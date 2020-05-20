import { ApolloClient, ApolloClientOptions } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import {
  GQLItem,
  ItemId,
  Variables,
  Data,
  ApolloClientManagerInterface,
  ItemKeys,
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

  optimisticItem(
    itemKey: ItemKeys,
    item: Partial<GQLItem>
  ): { __typename: "Mutation" } & { [itemKey in ItemKeys]?: Partial<GQLItem> } {
    const { id, ...other } = item;
    return {
      __typename: "Mutation",
      [itemKey]: {
        __typename: "Item",
        id: id || tmpId(),
        ...other,
      },
    };
  }

  optimisticCreateItem(item: Variables["createItem"]): Data["createItem"] {
    return this.optimisticItem("createItem", item) as Data["createItem"];
  }

  optimisticDestroyItem(item: Variables["destroyItem"]): Data["destroyItem"] {
    return this.optimisticItem("destroyItem", item) as Data["destroyItem"];
  }

  optimisticCreateRelatedItem(
    item: Variables["createItem"]
  ): Data["createRelatedItem"] {
    return this.optimisticItem(
      "createRelatedItem",
      item
    ) as Data["createRelatedItem"];
  }

  addItem(item: Data["createItem"]["createItem"]): void {
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

  removeItem({ id }: Data["destroyItem"]["destroyItem"]): void {
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

  addRelatedItem(
    relatedToId: ItemId,
    relationType: string,
    item: Data["createRelatedItem"]["createRelatedItem"]
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
          },
        },
      });
    }
  }

  removeRelatedItem(
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

  updateOnCreateItem() {
    return (_: DataProxy, { data }: FetchResult<Data["createItem"]>): void => {
      const createItem = data?.createItem;
      if (createItem !== undefined) {
        this.addItem(createItem);
      }
    };
  }

  updateOnDestroyItem() {
    return (_: DataProxy, { data }: FetchResult<Data["destroyItem"]>): void => {
      const destroyItem = data?.destroyItem;
      if (destroyItem !== undefined) {
        this.removeItem(destroyItem);
      }
    };
  }

  updateOnCreateRelatedItem(relatedToId: ItemId, relationType: string) {
    return (
      _: DataProxy,
      { data }: FetchResult<Data["createRelatedItem"]>
    ): void => {
      const createRelatedItem = data?.createRelatedItem;
      if (createRelatedItem !== undefined) {
        this.addRelatedItem(relatedToId, relationType, createRelatedItem);
        this.addItem(createRelatedItem);
      }
    };
  }
}
