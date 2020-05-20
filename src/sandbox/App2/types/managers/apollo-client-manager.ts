import { ApolloClient } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import { ItemId, Data, Variables } from "../main";

export type ItemKeys = "createItem" | "destroyItem" | "createRelatedItem";

export interface ApolloClientManagerInterface {
  client: ApolloClient<NormalizedCacheObject>;

  optimisticCreateItem(item: Variables["createItem"]): Data["createItem"];
  optimisticDestroyItem(item: Variables["destroyItem"]): Data["destroyItem"];
  optimisticCreateRelatedItem(
    item: Variables["createItem"]
  ): Data["createRelatedItem"];

  onCompletedGetItemWithRelatedItems(): (
    data: Data["itemWithRelatedItems"]
  ) => void;

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
