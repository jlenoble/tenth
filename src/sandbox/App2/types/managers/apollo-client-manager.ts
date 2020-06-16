import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject, IdGetterObj } from "apollo-cache-inmemory";
import { AnyAction, Store } from "redux";
import { RequiredKeys } from "../../../../generics";
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
  manager: ApolloClientManagerInterface;
};
export type MetaAction<Action> = Action & { meta: Meta };

export const BEGIN = "BEGIN";
export const COMMIT = "COMMIT";
export const REVERT = "REVERT";

export type OptimistType = typeof BEGIN | typeof COMMIT | typeof REVERT;

export type Optimist = {
  optimist: {
    id: number;
    type: OptimistType;
    index: number;
  };
};
export type OptimisticAction<Action> = Action & { meta: Optimist };
export type MaybePreOptimisticAction<Action> = Action & {
  meta: { optimisticId?: number | null; error?: true };
};
export type PreOptimisticAction<Action> = Action & {
  meta: { optimisticId: number; error?: true };
};

export type DataIdFromObject = (
  value: Partial<{
    __typename: string;
    id: string;
    item: RequiredKeys<Partial<ClientItem>, "id">;
    relation: RequiredKeys<Partial<ClientRelationship>, "id">;
  }>
) => string | null | undefined;

export interface ApolloClientManagerInterface {
  client: ApolloClient<NormalizedCacheObject>;
  store: Store;
  dataIdFromObject<T extends IdGetterObj>(value: T): string | null | undefined;

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

  resetViews(views: Set<string>, state: State): void;
  addRelatedItem(
    item: ClientItem,
    relationship: ClientRelationship,
    updateStore?: boolean
  ): void;
  destroyViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"]
  ): void;
  removeFromViews(
    items: Data["itemWithRelatedItems"]["itemWithRelatedItems"]["items"],
    updateStore?: boolean
  ): void;
  updateViewsAfterRelationshipUpdate(
    prevRelationship: ClientRelationship,
    newRelationship: ClientRelationship,
    updateStore?: boolean
  ): void;
}
