import { ApolloClient } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import {
  NormalizedCacheObject,
  InMemoryCache,
  IdGetter,
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { AnyAction, Store } from "redux";

import {
  ViewId,
  Ids,
  Variables,
  Data,
  State,
  ApolloClientManagerInterface,
  ClientItem,
  ClientRelationship,
} from "../types";
import {
  addItems,
  addRelationships,
  addRelationshipsForItem,
  addViewForItem,
  addViewForSubItems,
  createRelatedItem,
  destroyItem,
} from "../redux-reducers";
import { nodes } from "../client/graphql-nodes";
import { ApolloHooksManager } from "./apollo-hooks-manager";
import { ReduxManager } from "./redux-manager";

let _id = 0;
const tmpId = (): number => --_id;

export class ApolloClientManager implements ApolloClientManagerInterface {
  public readonly client: ApolloClient<NormalizedCacheObject>;
  public readonly hooks: ApolloHooksManager;
  public readonly redux: ReduxManager;
  public readonly store: Store<State>;
  public readonly dataIdFromObject: IdGetter;

  private optimisticCacheLayers: any = new Map();

  constructor({
    link,
    dataIdFromObject,
  }: {
    link: HttpLink;
    dataIdFromObject: IdGetter;
  }) {
    this.client = new ApolloClient({
      cache: new InMemoryCache({ dataIdFromObject }),
      link,
    });

    this.dataIdFromObject = dataIdFromObject;

    this.redux = new ReduxManager({ log: true });
    this.store = this.redux.store;
    this.hooks = new ApolloHooksManager(this);

    this.redux.sagaManager.run();

    this.updateOnCreateItem = this.updateOnCreateItem.bind(this);
    this.updateOnDestroyItem = this.updateOnDestroyItem.bind(this);

    this.updateOnCreateRelatedItem = this.updateOnCreateRelatedItem.bind(this);
  }

  dispatch<TAction extends AnyAction>(action: TAction): TAction {
    return this.store.dispatch(action);
  }

  select<TSelected = unknown>(
    selector: (state: State) => TSelected
  ): TSelected {
    return selector(this.store.getState());
  }

  optimisticCreateItem(item: Variables["createItem"]): Data["createItem"] {
    return {
      __typename: "Mutation",
      createItem: {
        __typename: "Item",
        id: tmpId(),
        ...item,
      },
    };
  }

  optimisticDestroyItem(item: Variables["destroyItem"]): Data["destroyItem"] {
    return {
      __typename: "Mutation",
      destroyItem: {
        __typename: "Item",
        ...item,
      },
    };
  }

  optimisticCreateRelatedItem({
    relatedToId,
    relationId,
    ...item
  }: Variables["createRelatedItem"]): Data["createRelatedItem"] {
    const relatedId = tmpId();

    return {
      __typename: "Mutation",
      createRelatedItem: {
        __typename: "RelatedItem",
        item: {
          __typename: "Item",
          id: relatedId,
          ...item,
        },
        relationship: {
          __typename: "Relationship",
          id: tmpId(),
          ids: [relatedToId, relationId, relatedId],
        },
      },
    };
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

        this._updateReduxStore({
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
      this._updateReduxStore({ items: data.itemsById });
    };
  }

  _updateReduxStore({
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

      this.dispatch(
        addRelationshipsForItem(
          relationships.map(({ ids }) => {
            return ids as Ids;
          })
        )
      );
    }
  }

  updateOnCreateItem() {
    return (_: DataProxy, { data }: FetchResult<Data["createItem"]>): void => {
      const createItem = data?.createItem;
      if (createItem !== undefined) {
        console.log("updateOnCreateItem", createItem);
        // this._addItem(createItem);
      }
    };
  }

  updateOnDestroyItem() {
    return (_: DataProxy, { data }: FetchResult<Data["destroyItem"]>): void => {
      const item = data?.destroyItem;

      if (item !== undefined) {
        this._optimisticDispatch(
          (optimisticId: number, begin: boolean): void => {
            this.dispatch(
              destroyItem(item, { optimisticId, begin, manager: this })
            );
          }
        );
      }
    };
  }

  updateOnCreateRelatedItem() {
    return (
      _: DataProxy,
      { data }: FetchResult<Data["createRelatedItem"]>
    ): void => {
      const item = data?.createRelatedItem;

      if (item !== undefined) {
        this._optimisticDispatch(
          (optimisticId: number, begin: boolean): void => {
            this.dispatch(
              createRelatedItem(item, { optimisticId, begin, manager: this })
            );
          }
        );
      }
    };
  }

  _optimisticDispatch(
    cb: (optimisticId: number, begin: boolean) => void
  ): void {
    const data = (this.client.cache as any).data;

    if (data.parent) {
      const optimisticId = -parseInt(data.optimisticId, 10);
      this.optimisticCacheLayers.set(data.parent, optimisticId);
      cb(optimisticId, true);
    } else {
      const optimisticId = this.optimisticCacheLayers.get(data);
      cb(optimisticId, false);
      this.optimisticCacheLayers.delete(data);
    }
  }

  _addRelatedItem(
    item: ClientItem,
    { id: relationshipId, ids: [relatedToId, relationId] }: ClientRelationship
  ): void {
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
  }

  _removeRelatedItem([relatedToId, relationId, relatedId]: Ids): void {
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
