import { ApolloClient } from "apollo-client";
import {
  NormalizedCacheObject,
  InMemoryCache,
  IdGetter,
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { AnyAction, Store } from "redux";

import {
  ViewId,
  Variables,
  Data,
  State,
  ApolloClientManagerInterface,
  ClientItem,
  ClientRelationship,
  MetaAction,
} from "../types";
import {
  addItems,
  addRelationships,
  addRelationshipsForItem,
  addViewForItem,
  addViewForSubItems,
  getViewsForItem,
  getViewsForSubItem,
  removeAllRelationshipsForItem,
  removeAllViewsForItem,
  removeAllViewsForSubItem,
} from "../redux-reducers";
import { nodes } from "../client/graphql-nodes";
import { ApolloHooksManager } from "./apollo-hooks-manager";
import { ReduxManager } from "./redux-manager";
import { OptimistManager } from "./optimist-manager";
import { UpdateManager } from "./update-manager";

export class ApolloClientManager implements ApolloClientManagerInterface {
  public readonly client: ApolloClient<NormalizedCacheObject>;
  public readonly store: Store<State>;
  public readonly dataIdFromObject: IdGetter;

  public readonly hooksManager: ApolloHooksManager;
  public readonly reduxManager: ReduxManager;
  public readonly optimistManager: OptimistManager;
  public readonly updateManager: UpdateManager;

  private optimisticCacheLayers: any = new Map();

  constructor({
    link,
    dataIdFromObject,
    log = false,
    optimist = true,
  }: {
    link: HttpLink;
    dataIdFromObject: IdGetter;
    log?: boolean;
    optimist?: boolean;
  }) {
    this.client = new ApolloClient({
      cache: new InMemoryCache({ dataIdFromObject }),
      link,
    });

    this.dataIdFromObject = dataIdFromObject;

    this.optimistManager = new OptimistManager(optimist);
    this.updateManager = new UpdateManager({ clientManager: this });
    this.reduxManager = new ReduxManager({
      log,
      optimist,
      clientManager: this,
    });
    this.store = this.reduxManager.store;
    this.hooksManager = new ApolloHooksManager(this);

    this.reduxManager.sagaManager.run();
  }

  dispatch<TAction extends AnyAction>(action: TAction): MetaAction<TAction> {
    return this.reduxManager.dispatch(action);
  }

  select<TSelected = unknown>(
    selector: (state: State) => TSelected
  ): TSelected {
    return this.reduxManager.select(selector);
  }

  onCompletedGetItemWithRelatedItems() {
    return (data: Data["itemWithRelatedItems"]): void => {
      const itemWithRelatedItems = data.itemWithRelatedItems;

      if (itemWithRelatedItems !== undefined) {
        const { relation, item, items, relationshipIds } = itemWithRelatedItems;
        const { id: relatedToId } = item;
        const { id: relationId } = relation;

        const relationships = relationshipIds.map((id, i) => {
          return { id, ids: [relatedToId, relationId, items[i].id] };
        });

        this._updateReduxStoreOnCompletedQuery({
          item,
          relation,
          items,
          relationships,
          viewId: this.dataIdFromObject(itemWithRelatedItems),
        });
      }
    };
  }

  onCompletedGetItemsById() {
    return (data: Data["itemsById"]): void => {
      this._updateReduxStoreOnCompletedQuery({ items: data.itemsById });
    };
  }

  _updateReduxStoreOnCompletedQuery({
    item,
    relation,
    items,
    relationships = [],
    viewId,
  }: {
    item?: ClientItem;
    relation?: ClientItem;
    items: ClientItem[];
    relationships?: ClientRelationship[];
    viewId?: ViewId | null;
  }): void {
    const allItems = item
      ? relation
        ? items.concat([item, relation])
        : items.concat(item)
      : relation
      ? items.concat(relation)
      : items;

    if (allItems.length) {
      this.dispatch(addItems(allItems));
    }

    if (viewId) {
      if (item) {
        this.dispatch(addViewForItem(viewId, item.id));
      }

      if (relation) {
        this.dispatch(addViewForItem(viewId, relation.id));
      }

      if (items.length) {
        this.dispatch(
          addViewForSubItems(
            viewId,
            items.map(({ id }) => id)
          )
        );
      }
    }

    if (relationships.length) {
      this.dispatch(addRelationships(relationships));
      this.dispatch(addRelationshipsForItem(relationships));
    }
  }

  _updateReduxStoreOnItemDestroy(items: ClientItem[]): void {
    for (const { id } of items) {
      this.dispatch(removeAllRelationshipsForItem(id));
      this.dispatch(removeAllViewsForItem(id));
      this.dispatch(removeAllViewsForSubItem(id));
    }
  }

  // _addRelatedItem(
  //   item: ClientItem,
  //   { id: relationshipId, ids: [relatedToId, relationId] }: ClientRelationship
  // ): void {
  //   const query = this.client.readQuery<
  //     Data["itemWithRelatedItems"],
  //     Variables["itemWithRelatedItems"]
  //   >({
  //     variables: { relatedToId, relationId },
  //     query: nodes["itemWithRelatedItems"],
  //   });

  //   const itemWithRelatedItems = query?.itemWithRelatedItems;

  //   if (itemWithRelatedItems) {
  //     this.client.writeQuery<
  //       Data["itemWithRelatedItems"],
  //       Variables["itemWithRelatedItems"]
  //     >({
  //       variables: { relatedToId, relationId },
  //       query: nodes["itemWithRelatedItems"],
  //       data: {
  //         itemWithRelatedItems: {
  //           ...itemWithRelatedItems,
  //           items: [...itemWithRelatedItems.items, item],
  //           relationshipIds: [
  //             ...itemWithRelatedItems.relationshipIds,
  //             relationshipId,
  //           ],
  //         },
  //       },
  //     });
  //   }
  // }

  destroyViews(items: ClientItem[]): void {
    for (const item of items) {
      const viewsForItem = this.select(getViewsForItem(item.id));
      viewsForItem;
    }
  }

  removeFromViews(items: ClientItem[]): void {
    for (const item of items) {
      const relatedId = item.id;
      const viewsForSubItem = this.select(getViewsForSubItem(relatedId));

      for (const viewId of viewsForSubItem) {
        const [viewName, itemId, _relationId] = viewId.split(":");

        if (viewName === "ItemWithRelatedItems") {
          const relatedToId = parseInt(itemId, 10);
          const relationId = parseInt(_relationId, 10);

          const query = this.client.readQuery<
            Data["itemWithRelatedItems"],
            Variables["itemWithRelatedItems"]
          >({
            variables: { relatedToId, relationId },
            query: nodes["itemWithRelatedItems"],
          });

          const itemWithRelatedItems = query?.itemWithRelatedItems;

          if (itemWithRelatedItems) {
            let items = itemWithRelatedItems.items;
            let relationshipIds = itemWithRelatedItems.relationshipIds;

            const index = items.findIndex((item) => item.id === relatedId);

            if (index !== -1) {
              items = [...items.slice(0, index), ...items.slice(index + 1)];
              relationshipIds = [
                ...relationshipIds.slice(0, index),
                ...relationshipIds.slice(index + 1),
              ];

              this.client.writeQuery<
                Data["itemWithRelatedItems"],
                Variables["itemWithRelatedItems"]
              >({
                variables: { relatedToId, relationId },
                query: nodes["itemWithRelatedItems"],
                data: {
                  itemWithRelatedItems: {
                    ...itemWithRelatedItems,
                    items,
                    relationshipIds,
                  },
                },
              });
            }
          }
        }
      }
    }

    this._updateReduxStoreOnItemDestroy(items);
  }
}
