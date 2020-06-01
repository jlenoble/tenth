import { ApolloClient } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { AnyAction, Store } from "redux";

import { Data, Variables } from "../type-maps";
import { State } from "../states";
import { ReduxManager } from "../../managers";

export type Meta = {
  // optimisticId: number;
  // begin: boolean;
  manager: ApolloClientManagerInterface;
};
export type MetaAction<Action> = Action & { meta?: Meta };

export interface ApolloClientManagerInterface {
  client: ApolloClient<NormalizedCacheObject>;
  store: Store;
  redux: ReduxManager;

  dispatch<TAction extends AnyAction>(action: TAction): MetaAction<TAction>;
  select<TSelected = unknown>(selector: (state: State) => TSelected): TSelected;

  optimisticCreateItem(item: Variables["createItem"]): Data["createItem"];
  optimisticDestroyItem(item: Variables["destroyItem"]): Data["destroyItem"];
  optimisticCreateRelatedItem(
    item: Variables["createItem"]
  ): Data["createRelatedItem"];

  onCompletedGetItemWithRelatedItems(): (
    data: Data["itemWithRelatedItems"]
  ) => void;
  onCompletedGetItemsById(): (data: Data["itemsById"]) => void;

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

  destroyViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"]
  ): void;
  removeFromViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"]
  ): void;
}
