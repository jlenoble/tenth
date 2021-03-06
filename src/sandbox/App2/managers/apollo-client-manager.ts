import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject, InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { AnyAction, Store } from "redux";

import {
  ItemId,
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
  getItem,
  getItemsById,
  getRelationshipsForLeftItemAndRelation,
  addToOrder,
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

    this.apolloHooksManager = new ApolloHooksManager({
      clientManager: this,
      optimistManager: this.optimistManager,
      updateManager: this.updateManager,
      completedManager: this.completedManager,
    });
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
    sort,
  }: {
    item?: ClientItem;
    relation?: ClientItem;
    items: ClientItem[];
    relationships?: ClientRelationship[];
    viewId?: ViewId | null;
    sort?: boolean;
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

    if (sort && item && relation) {
      const categoryId = item.id;
      const orderId = relation.id;

      this.dispatch(addToOrder({ categoryId, orderId, relationships }));
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

  resetViews(views: Set<string>, state: State): void {
    for (const viewId of views) {
      const [viewName, itemId, _relationId] = viewId.split(":");

      if (viewName === "ItemWithRelatedItems") {
        const relatedToId = parseInt(itemId, 10);
        const relationId = parseInt(_relationId, 10);

        const relationships = getRelationshipsForLeftItemAndRelation({
          relatedToId,
          relationId,
        })(state);
        const items = getItemsById(
          relationships.map(({ ids: [, , relatedId] }) => relatedId)
        )(state);
        const relationshipIds = relationships.map(({ id }) => id);

        const query = this.client.readQuery<
          Data["itemWithRelatedItems"],
          Variables["itemWithRelatedItems"]
        >({
          variables: { relatedToId, relationId },
          query: nodes["itemWithRelatedItems"],
        });

        if (query) {
          this.client.writeQuery<
            Data["itemWithRelatedItems"],
            Variables["itemWithRelatedItems"]
          >({
            variables: { relatedToId, relationId },
            query: nodes["itemWithRelatedItems"],
            data: {
              itemWithRelatedItems: {
                ...query.itemWithRelatedItems,
                items,
                relationshipIds,
              },
            },
          });
        }
      }
    }
  }

  addRelatedItem(
    item: ClientItem,
    relationship: ClientRelationship,
    updateStore = true
  ): void {
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

    if (updateStore) {
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
  }

  addOrderedItem(
    item: ClientItem,
    order: ClientItem,
    orderRelationship: ClientRelationship,
    relationships: ClientRelationship[],
    updateStore = true
  ): void {
    const {
      ids: [relatedToId, relationId],
    } = orderRelationship;

    const query = this.client.readQuery<
      Data["itemWithOrderedItems"],
      Variables["itemWithOrderedItems"]
    >({
      variables: { relatedToId, relationId },
      query: nodes["itemWithOrderedItems"],
    });

    const itemWithOrderedItems = query?.itemWithOrderedItems;

    if (itemWithOrderedItems) {
      this.client.writeQuery<
        Data["itemWithOrderedItems"],
        Variables["itemWithOrderedItems"]
      >({
        variables: { relatedToId, relationId },
        query: nodes["itemWithOrderedItems"],
        data: {
          itemWithOrderedItems: {
            ...itemWithOrderedItems,
            items: [...itemWithOrderedItems.items, item],
            relationships: [
              ...itemWithOrderedItems.relationships,
              ...relationships,
            ],
          },
        },
      });
    }

    if (updateStore) {
      this.addToStore({
        item: { id: relatedToId, title: "" },
        relation: order,
        items: [item],
        relationships,
        viewId: this.dataIdFromObject({
          __typename: "ItemWithOrderedItems",
          item: { id: relatedToId },
          relation: { id: relationId },
        }),
        sort: true,
      });
    }
  }

  destroyViews(items: ClientItem[]): void {
    for (const item of items) {
      const viewsForItem = this.select(getViewsForItem(item.id));
      viewsForItem;
    }
  }

  removeFromView(relatedId: ItemId, viewId: string): void {
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

  removeFromViews(items: ClientItem[], updateStore = true): void {
    for (const item of items) {
      const relatedId = item.id;
      const viewsForSubItem = this.select(getViewsForSubItem(relatedId));

      for (const viewId of viewsForSubItem) {
        this.removeFromView(relatedId, viewId);
      }
    }

    if (updateStore) {
      this.removeFromStore(items);
    }
  }

  updateViewsAfterRelationshipUpdate(
    prevRelationship: ClientRelationship,
    newRelationship: ClientRelationship,
    updateStore = true
  ): void {
    let [relatedToId, relationId, relatedId] = prevRelationship.ids;
    let viewsForItem = this.select(getViewsForItem(relatedToId));
    let item = this.select(getItem(relatedId));

    for (const viewId of viewsForItem) {
      const [viewName, itemId, _relationId] = viewId.split(":");

      if (
        viewName === "ItemWithRelatedItems" &&
        relatedToId === parseInt(itemId, 10) &&
        relationId === parseInt(_relationId, 10)
      ) {
        this.removeFromView(relatedId, viewId);

        if (updateStore && item) {
          this.removeFromStore([item]);
        }
      }
    }

    [relatedToId, relationId, relatedId] = newRelationship.ids;
    viewsForItem = this.select(getViewsForItem(relatedToId));
    item = this.select(getItem(relatedId));

    for (const viewId of viewsForItem) {
      const [viewName, itemId, _relationId] = viewId.split(":");

      if (
        viewName === "ItemWithRelatedItems" &&
        relatedToId === parseInt(itemId, 10) &&
        relationId === parseInt(_relationId, 10) &&
        item
      ) {
        this.addRelatedItem(item, newRelationship, updateStore);
      }
    }
  }
}
