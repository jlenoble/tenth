import { ApolloClient, ApolloClientOptions } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import { GQLItem } from "../types";

import {
  CreateItemMutation,
  CreateRelatedItemMutation,
  CreateItemMutationVariables,
  DestroyItemMutation,
  DestroyItemMutationVariables,
  GetItems,
  GetItemsQuery,
  GetItemsQueryVariables,
} from "../__generated__";

let id = 0;
const tmpId = (): number => --id;

type ItemKeys = "createItem" | "destroyItem" | "createRelatedItem";

export class ApolloClientManager {
  public readonly client: ApolloClient<NormalizedCacheObject>;

  constructor({ cache, link }: ApolloClientOptions<NormalizedCacheObject>) {
    this.client = new ApolloClient({
      cache,
      link,
    });

    this.updateOnCreateItem = this.updateOnCreateItem.bind(this);
    this.updateOnDestroyItem = this.updateOnDestroyItem.bind(this);
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

  optimisticCreateItem(item: CreateItemMutationVariables): CreateItemMutation {
    return this.optimisticItem("createItem", item) as CreateItemMutation;
  }

  optimisticDestroyItem(
    item: DestroyItemMutationVariables
  ): DestroyItemMutation {
    return this.optimisticItem("destroyItem", item) as DestroyItemMutation;
  }

  optimisticRelatedItem(
    item: CreateItemMutationVariables
  ): CreateRelatedItemMutation {
    return this.optimisticItem(
      "createRelatedItem",
      item
    ) as CreateRelatedItemMutation;
  }

  addItem(item: CreateItemMutation["createItem"]): void {
    const query = this.client.readQuery<GetItemsQuery, GetItemsQueryVariables>({
      query: GetItems,
    });

    if (query !== null) {
      this.client.writeQuery<GetItemsQuery, GetItemsQueryVariables>({
        query: GetItems,
        data: { items: [...query.items, item] },
      });
    }
  }

  removeItem({ id }: DestroyItemMutation["destroyItem"]): void {
    const query = this.client.readQuery<GetItemsQuery, GetItemsQueryVariables>({
      query: GetItems,
    });

    if (query !== null) {
      let items = query.items;
      const index = items.findIndex((item) => item?.id === id);

      if (index !== -1) {
        items = [...items.slice(0, index), ...items.slice(index + 1)];
        this.client.writeQuery<GetItemsQuery, GetItemsQueryVariables>({
          query: GetItems,
          data: { items },
        });
      }
    }
  }

  updateOnCreateItem(
    _: DataProxy,
    { data }: FetchResult<CreateItemMutation>
  ): void {
    const createItem = data?.createItem;
    if (createItem !== undefined) {
      this.addItem(createItem);
    }
  }

  updateOnDestroyItem(
    _: DataProxy,
    { data }: FetchResult<DestroyItemMutation>
  ): void {
    const destroyItem = data?.destroyItem;
    if (destroyItem !== undefined) {
      this.removeItem(destroyItem);
    }
  }
}
