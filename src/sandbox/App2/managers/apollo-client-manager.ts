import { ApolloClient, ApolloClientOptions } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import {
  ItemId,
  Variables,
  Data,
  ApolloClientManagerInterface,
} from "../types";

import { nodes } from "../client/graphql-nodes";
import { ApolloHooksManager } from "./apollo-hooks-manager";

let id = 0;
const tmpId = (): number => --id;

export class ApolloClientManager implements ApolloClientManagerInterface {
  public readonly client: ApolloClient<NormalizedCacheObject>;
  public readonly hooks: ApolloHooksManager;

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
    relationType,
    ...item
  }: Variables["createRelatedItem"]): Data["createRelatedItem"] {
    const itemId2 = tmpId();

    return {
      __typename: "Mutation",
      createRelatedItem: {
        __typename: "ItemWithRelation",
        item: {
          __typename: "Item",
          id: itemId2,
          ...item,
        },
        relation: {
          __typename: "Relation",
          id: tmpId(),
          type: relationType,
          itemId1: relatedToId,
          itemId2,
        },
      },
    };
  }

  _addItem(item: Data["createItem"]["createItem"]): void {
    const query = this.client.readQuery<Data["items"], Variables["items"]>({
      query: nodes["items"],
    });

    if (query !== null) {
      this.client.writeQuery<Data["items"], Variables["items"]>({
        query: nodes["items"],
        data: { items: [...query.items, item] },
      });
    }
  }

  _removeItem({ id }: Data["destroyItem"]["destroyItem"]): void {
    const query = this.client.readQuery<Data["items"], Variables["items"]>({
      query: nodes["items"],
    });

    if (query !== null) {
      let items = query.items;
      const index = items.findIndex((item) => item.id === id);

      if (index !== -1) {
        items = [...items.slice(0, index), ...items.slice(index + 1)];
        this.client.writeQuery<Data["items"], Variables["items"]>({
          query: nodes["items"],
          data: { items },
        });
      }
    }
  }

  _addRelatedItem({
    item,
    relation: { id: relationId, itemId1: relatedToId, type: relationType },
  }: Data["createRelatedItem"]["createRelatedItem"]): void {
    const query = this.client.readQuery<
      Data["itemWithRelatedItems"],
      Variables["itemWithRelatedItems"]
    >({
      variables: { relatedToId, relationType },
      query: nodes["itemWithRelatedItems"],
    });

    const itemWithRelatedItems = query?.itemWithRelatedItems;

    if (itemWithRelatedItems) {
      this.client.writeQuery<
        Data["itemWithRelatedItems"],
        Variables["itemWithRelatedItems"]
      >({
        variables: { relatedToId, relationType },
        query: nodes["itemWithRelatedItems"],
        data: {
          itemWithRelatedItems: {
            ...itemWithRelatedItems,
            items: [...itemWithRelatedItems.items, item],
            relations: [...itemWithRelatedItems.relations, relationId],
          },
        },
      });
    }
  }

  _removeRelatedItem(
    relatedToId: ItemId,
    relationType: string,
    { id }: Data["destroyItem"]["destroyItem"]
  ): void {
    const query = this.client.readQuery<
      Data["itemWithRelatedItems"],
      Variables["itemWithRelatedItems"]
    >({
      variables: { relatedToId, relationType },
      query: nodes["itemWithRelatedItems"],
    });

    const itemWithRelatedItems = query?.itemWithRelatedItems;

    if (itemWithRelatedItems) {
      let items = itemWithRelatedItems.items;
      const index = items.findIndex((item) => item.id === id);

      if (index !== -1) {
        items = [...items.slice(0, index), ...items.slice(index + 1)];

        this.client.writeQuery<
          Data["itemWithRelatedItems"],
          Variables["itemWithRelatedItems"]
        >({
          variables: { relatedToId, relationType },
          query: nodes["itemWithRelatedItems"],
          data: {
            itemWithRelatedItems: {
              ...itemWithRelatedItems,
              items,
            },
          },
        });
      }
    }
  }

  onCompletedGetItemWithRelatedItems() {
    return (data: Data["itemWithRelatedItems"]): void => {
      const itemWithRelatedItems = data?.itemWithRelatedItems;

      if (itemWithRelatedItems !== undefined) {
        const {
          relationType: type,
          item: { id: itemId1 },
          items,
          relations,
        } = itemWithRelatedItems;

        relations.forEach((id, i) => {
          console.log({
            id,
            type,
            itemId1,
            itemId2: items[i].id,
          });
        });
      }
    };
  }

  updateOnCreateItem() {
    return (_: DataProxy, { data }: FetchResult<Data["createItem"]>): void => {
      const createItem = data?.createItem;
      if (createItem !== undefined) {
        this._addItem(createItem);
      }
    };
  }

  updateOnDestroyItem() {
    return (_: DataProxy, { data }: FetchResult<Data["destroyItem"]>): void => {
      const destroyItem = data?.destroyItem;
      if (destroyItem !== undefined) {
        this._removeItem(destroyItem);
      }
    };
  }

  updateOnCreateRelatedItem() {
    return (
      _: DataProxy,
      { data }: FetchResult<Data["createRelatedItem"]>
    ): void => {
      const createRelatedItem = data?.createRelatedItem;
      if (createRelatedItem !== undefined) {
        this._addRelatedItem(createRelatedItem);
        this._addItem(createRelatedItem.item);
      }
    };
  }
}
