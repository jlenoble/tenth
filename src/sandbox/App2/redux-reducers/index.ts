export * from "./current-path";
export * from "./items";
export * from "./ncards";
export * from "./relationships";
export * from "./relationships-for-item";
export * from "./views-for-item";
export * from "./views-for-subitem";
export * from "./selectors";

import {
  Data,
  MaybePreOptimisticAction,
  State,
  ClientItem,
  ClientRelationship,
} from "../types";

export const DO_NOTHING = "DO_NOTHING";
export const RESET_ALL = "RESET_ALL";

export const CREATE_RELATED_ITEM = "CREATE_RELATED_ITEM";
export const DESTROY_ITEM = "DESTROY_ITEM";
export const DESTROY_ITEM_REVERT = "DESTROY_ITEM_REVERT";
export const UPDATE_ITEM = "UPDATE_ITEM";

export type DoNothingAction = {
  type: typeof DO_NOTHING;
};

export type ResetAllAction = {
  type: typeof RESET_ALL;
  payload: { views: Set<string>; state: State };
};

export type CreateRelatedItemAction = {
  type: typeof CREATE_RELATED_ITEM;
  payload: Data["createRelatedItem"]["createRelatedItem"];
};

export type DestroyItemAction = {
  type: typeof DESTROY_ITEM;
  payload: Data["destroyItem"]["destroyItem"];
};

export type DestroyItemRevertAction = {
  type: typeof DESTROY_ITEM_REVERT;
  payload: { items: ClientItem[]; relationships: ClientRelationship[] };
};

export type UpdateItemAction = {
  type: typeof UPDATE_ITEM;
  payload: Data["updateItem"]["updateItem"];
};

export const doNothing = (): DoNothingAction => {
  return { type: DO_NOTHING };
};

export const resetAll = (views: Set<string>, state: State): ResetAllAction => {
  return { type: RESET_ALL, payload: { views, state } };
};

export const createRelatedItem = (
  item: Data["createRelatedItem"]["createRelatedItem"],
  optimisticId?: number,
  error?: true
): MaybePreOptimisticAction<CreateRelatedItemAction> => ({
  type: CREATE_RELATED_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});

export const destroyItem = (
  item: Data["destroyItem"]["destroyItem"],
  optimisticId?: number | null,
  error?: true
): MaybePreOptimisticAction<DestroyItemAction> => ({
  type: DESTROY_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});

export const destroyItemRevert = (
  payload: DestroyItemRevertAction["payload"]
): DestroyItemRevertAction => ({
  type: DESTROY_ITEM_REVERT,
  payload,
});

export const updateItem = (
  item: Data["updateItem"]["updateItem"],
  optimisticId?: number | null,
  error?: true
): MaybePreOptimisticAction<UpdateItemAction> => ({
  type: UPDATE_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});
