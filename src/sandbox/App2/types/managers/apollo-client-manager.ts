import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject, IdGetter } from "apollo-cache-inmemory";
import { AnyAction, Store } from "redux";

import { Data } from "../type-maps";
import { State } from "../states";
import {
  ReduxManager,
  OptimistManager,
  UpdateManager,
  CompletedManager,
} from "../../managers";
import { ClientItem, ClientRelationship, ViewId } from "../models";

export type Meta = {
  // optimisticId: number;
  // begin: boolean;
  manager: ApolloClientManagerInterface;
};
export type MetaAction<Action> = Action & { meta?: Meta };

export interface ApolloClientManagerInterface {
  client: ApolloClient<NormalizedCacheObject>;
  store: Store;
  dataIdFromObject: IdGetter;

  reduxManager: ReduxManager;
  optimistManager: OptimistManager;
  updateManager: UpdateManager;
  completedManager: CompletedManager;

  dispatch<TAction extends AnyAction>(action: TAction): MetaAction<TAction>;
  select<TSelected = unknown>(selector: (state: State) => TSelected): TSelected;

  addToStore({
    item,
    relation,
    items,
    relationships,
    viewId,
  }: {
    item?: ClientItem;
    relation?: ClientItem;
    items: ClientItem[];
    relationships?: ClientRelationship[];
    viewId?: ViewId | null;
  }): void;
  removeFromStore(items: ClientItem[]): void;

  destroyViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"]
  ): void;
  removeFromViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"]
  ): void;
}
