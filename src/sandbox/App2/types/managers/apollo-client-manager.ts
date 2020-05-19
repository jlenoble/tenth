import { ApolloClient } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import { GQLItem, ItemId, Data, Variables } from "../main";

export type ItemKeys = "createItem" | "destroyItem" | "createRelatedItem";

export interface ApolloClientManagerInterface {
  client: ApolloClient<NormalizedCacheObject>;

  optimisticItem(
    itemKey: ItemKeys,
    item: Partial<GQLItem>
  ): { __typename: "Mutation" } & { [itemKey in ItemKeys]?: Partial<GQLItem> };

  optimisticCreateItem(item: Variables["createItem"]): Data["createItem"];
  optimisticDestroyItem(item: Variables["destroyItem"]): Data["destroyItem"];
  optimisticCreateRelatedItem(
    item: Variables["createItem"]
  ): Data["createRelatedItem"];

  addItem(item: Data["createItem"]["createItem"]): void;
  removeItem({ id }: Data["destroyItem"]["destroyItem"]): void;
  addRelatedItem(
    relatedToId: ItemId,
    relationType: string,
    item: Data["createRelatedItem"]["createRelatedItem"]
  ): void;

  updateOnCreateItem(): (
    _: DataProxy,
    { data }: FetchResult<Data["createItem"]>
  ) => void;
  updateOnDestroyItem(): (
    _: DataProxy,
    { data }: FetchResult<Data["destroyItem"]>
  ) => void;
  updateOnCreateRelatedItem(
    relatedToId: ItemId,
    relationType: string
  ): (_: DataProxy, { data }: FetchResult<Data["createRelatedItem"]>) => void;
}
