import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { AnyAction, Store } from "redux";

import { Data } from "../type-maps";
import { State } from "../states";
import { ReduxManager, OptimistManager, UpdateManager } from "../../managers";

export type Meta = {
  // optimisticId: number;
  // begin: boolean;
  manager: ApolloClientManagerInterface;
};
export type MetaAction<Action> = Action & { meta?: Meta };

export interface ApolloClientManagerInterface {
  client: ApolloClient<NormalizedCacheObject>;
  store: Store;
  reduxManager: ReduxManager;
  optimistManager: OptimistManager;
  updateManager: UpdateManager;

  dispatch<TAction extends AnyAction>(action: TAction): MetaAction<TAction>;
  select<TSelected = unknown>(selector: (state: State) => TSelected): TSelected;

  onCompletedGetItemWithRelatedItems(): (
    data: Data["itemWithRelatedItems"]
  ) => void;
  onCompletedGetItemsById(): (data: Data["itemsById"]) => void;

  destroyViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"]
  ): void;
  removeFromViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"]
  ): void;
}
