import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject, InMemoryCache } from "apollo-cache-inmemory";
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
  DataIdFromObject,
} from "../types";
import {
  addItems,
  addRelationships,
  addRelationshipsForItem,
  addViewForItem,
  addViewForSubItems,
  getViewsForItem,
  getViewsForSubItem,
  getCurrentPath,
  removeAllRelationshipsForItem,
  removeAllViewsForItem,
  removeAllViewsForSubItem,
  setCurrentPath,
  setNCards,
} from "../redux-reducers";
import { nodes } from "../client/graphql-nodes";
import { ApolloHooksManager } from "./apollo-hooks-manager";
import { ReduxHooksManager } from "./redux-hooks-manager";
import { ReduxManager } from "./redux-manager";
import { OptimistManager } from "./optimist-manager";
import { UpdateManager } from "./update-manager";
import { CompletedManager } from "./completed-manager";

export class ApolloClientManager implements ApolloClientManagerInterface {
  public readonly client: ApolloClient<NormalizedCacheObject>;
  public readonly store: Store<State>;
  public readonly dataIdFromObject: DataIdFromObject;

  public readonly apolloHooksManager: ApolloHooksManager;
  public readonly reduxHooksManager: ReduxHooksManager;

  public readonly reduxManager: ReduxManager;
  public readonly optimistManager: OptimistManager;
  public readonly updateManager: UpdateManager;
  public readonly completedManager: CompletedManager;

  constructor({
    link,
    dataIdFromObject,
    log = false,
    optimist = true,
  }: {
    link: HttpLink;
    dataIdFromObject: DataIdFromObject;
    log?: boolean;
    optimist?: boolean;
  }) {
    this.client = new ApolloClient({
      cache: new InMemoryCache({ dataIdFromObject }),
      link,
    });

    this.dataIdFromObject = dataIdFromObject;

    this.optimistManager = new OptimistManager({
      enabled: optimist,
      clientManager: this,
    });
    this.updateManager = new UpdateManager({ clientManager: this });
    this.completedManager = new CompletedManager({ clientManager: this });
    this.reduxManager = new ReduxManager({
      log,
      clientManager: this,
    });
    this.store = this.reduxManager.store;

    this.apolloHooksManager = new ApolloHooksManager(this);
    this.reduxHooksManager = new ReduxHooksManager(this);

    this.reduxManager.sagaManager.run();
  }

  dispatch<TAction extends AnyAction>(action: TAction): MetaAction<TAction> {
    const meta = { ...action.meta };
    meta.manager = this;
    action = { ...action, meta };
    return this.store.dispatch(this.optimistManager.optimisticAction(action));
  }

  select<TSelected = unknown>(
    selector: (state: State) => TSelected
  ): TSelected {
    return selector(this.store.getState());
  }

  addToStore({
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

  removeFromStore(items: ClientItem[]): void {
    for (const { id } of items) {
      this.dispatch(removeAllRelationshipsForItem(id));
      this.dispatch(removeAllViewsForItem(id));
      this.dispatch(removeAllViewsForSubItem(id));

      const currentPath = this.select(getCurrentPath);
      const index = currentPath.indexOf(id);

      switch (index) {
        case -1: {
          break;
        }

        case 0: {
          throw new Error("Root item may not be removed from path");
        }

        case 1: {
          this.dispatch(setNCards(1));
          this.dispatch(setCurrentPath([currentPath[0]]));
          break;
        }

        default: {
          this.dispatch(setCurrentPath(currentPath.slice(0, index)));
        }
      }
    }
  }

  addRelatedItem(item: ClientItem, relationship: ClientRelationship): void {
    const {
      id: relationshipId,
      ids: [relatedToId, relationId],
    } = relationship;

    const query = this.client.readQuery<
      Data["itemWithRelatedItems"],
      Variables["itemWithRelatedItems"]
    >({
      variables: { relatedToId, relationId },
      query: nodes["itemWithRelatedItems"],
    });

    const itemWithRelatedItems = query?.itemWithRelatedItems;

    if (itemWithRelatedItems) {
      this.client.writeQuery<
        Data["itemWithRelatedItems"],
        Variables["itemWithRelatedItems"]
      >({
        variables: { relatedToId, relationId },
        query: nodes["itemWithRelatedItems"],
        data: {
          itemWithRelatedItems: {
            ...itemWithRelatedItems,
            items: [...itemWithRelatedItems.items, item],
            relationshipIds: [
              ...itemWithRelatedItems.relationshipIds,
              relationshipId,
            ],
          },
        },
      });
    }

    this.addToStore({
      items: [item],
      relationships: [relationship],
      viewId: this.dataIdFromObject({
        __typename: "ItemWithRelatedItems",
        item: { id: relatedToId },
        relation: { id: relationId },
      }),
    });
  }

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

    this.removeFromStore(items);
  }
}
