import { ApolloClient } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import { Data, Variables } from "../main";

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
  updateOnCreateRelatedItem(): (
    _: DataProxy,
    { data }: FetchResult<Data["createRelatedItem"]>
  ) => void;
}
