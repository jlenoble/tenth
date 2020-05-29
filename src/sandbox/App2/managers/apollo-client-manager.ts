import { ApolloClient, ApolloClientOptions } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { Dispatch } from "redux";

import { Variables, Data, ApolloClientManagerInterface } from "../types";
import {
  addRelationshipsForItem,
  createRelatedItem,
  destroyItem,
} from "../redux-reducers";
import { nodes } from "../client/graphql-nodes";
import { ApolloHooksManager } from "./apollo-hooks-manager";

let _id = 0;
const tmpId = (): number => --_id;

export class ApolloClientManager implements ApolloClientManagerInterface {
  public readonly client: ApolloClient<NormalizedCacheObject>;
  public readonly hooks: ApolloHooksManager;

  private optimisticCacheLayers: any = new Map();

  constructor({ cache, link }: ApolloClientOptions<NormalizedCacheObject>) {
    this.client = new ApolloClient({
      cache,
      link,
    });

    this.hooks = new ApolloHooksManager(this);

    this.updateOnCreateItem = this.updateOnCreateItem.bind(this);
    this.updateOnDestroyItem = this.updateOnDestroyItem.bind(this);

    this.updateOnCreateRelatedItem = this.updateOnCreateRelatedItem.bind(this);
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

  onCompletedGetItemWithRelatedItems(dispatch: Dispatch) {
    return (data: Data["itemWithRelatedItems"]): void => {
      const item = data?.itemWithRelatedItems;

      if (item !== undefined) {
        const {
          relation: { id: relationId },
          item: { id: relatedToId },
          items,
          relationshipIds,
        } = item;

        dispatch(
          addRelationshipsForItem(
            relationshipIds.map((id, i) => {
              return [relatedToId, relationId, items[i].id];
            })
          )
        );
      }
    };
  }

  updateOnCreateItem(dispatch: Dispatch) {
    return (_: DataProxy, { data }: FetchResult<Data["createItem"]>): void => {
      const createItem = data?.createItem;
      if (createItem !== undefined) {
        console.log("updateOnCreateItem", createItem);
        // this._addItem(createItem);
      }
    };
  }

  updateOnDestroyItem(dispatch: Dispatch) {
    return (_: DataProxy, { data }: FetchResult<Data["destroyItem"]>): void => {
      const item = data?.destroyItem;

      if (item !== undefined) {
        this._optimisticDispatch(
          (optimisticId: number, begin: boolean): void => {
            dispatch(destroyItem(item, { optimisticId, begin, manager: this }));
          }
        );
      }
    };
  }

  updateOnCreateRelatedItem(dispatch: Dispatch) {
    return (
      _: DataProxy,
      { data }: FetchResult<Data["createRelatedItem"]>
    ): void => {
      const item = data?.createRelatedItem;

      if (item !== undefined) {
        this._optimisticDispatch(
          (optimisticId: number, begin: boolean): void => {
            dispatch(
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

  _addRelatedItem({
    item,
    relationship: {
      id: relationshipId,
      ids: [relatedToId, relationId],
    },
  }: Data["createRelatedItem"]["createRelatedItem"]): void {
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

  _removeRelatedItem({
    relationship: {
      ids: [relatedToId, relationId, relatedId],
    },
  }: Data["destroyRelatedItem"]["destroyRelatedItem"]): void {
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
