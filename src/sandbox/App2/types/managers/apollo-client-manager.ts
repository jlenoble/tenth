import { ApolloClient } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { Dispatch } from "redux";

import { Data, Variables } from "../main";

export interface ApolloClientManagerInterface {
  client: ApolloClient<NormalizedCacheObject>;

  optimisticCreateItem(item: Variables["createItem"]): Data["createItem"];
  optimisticDestroyItem(item: Variables["destroyItem"]): Data["destroyItem"];
  optimisticCreateRelatedItem(
    item: Variables["createItem"]
  ): Data["createRelatedItem"];

  onCompletedGetItemWithRelatedItems(
    dispatch: Dispatch
  ): (data: Data["itemWithRelatedItems"]) => void;

  updateOnCreateItem(
    dispatch: Dispatch
  ): (_: DataProxy, { data }: FetchResult<Data["createItem"]>) => void;
  updateOnDestroyItem(
    dispatch: Dispatch
  ): (_: DataProxy, { data }: FetchResult<Data["destroyItem"]>) => void;
  updateOnCreateRelatedItem(
    dispatch: Dispatch
  ): (_: DataProxy, { data }: FetchResult<Data["createRelatedItem"]>) => void;
}
