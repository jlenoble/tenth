export * from "./current-path";
export * from "./items";
export * from "./ncards";
export * from "./relationships";
export * from "./relationships-for-item";
export * from "./views-for-item";
export * from "./views-for-subitem";
export * from "./selectors";

import { State, ClientItem, ClientRelationship } from "../types";

export const DO_NOTHING = "DO_NOTHING";
export const RESET_ALL = "RESET_ALL";

export const DESTROY_ITEM_REVERT = "DESTROY_ITEM_REVERT";

export type DoNothingAction = {
  type: typeof DO_NOTHING;
};

export type ResetAllAction = {
  type: typeof RESET_ALL;
  payload: { views: Set<string>; state: State };
};

export type DestroyItemRevertAction = {
  type: typeof DESTROY_ITEM_REVERT;
  payload: { items: ClientItem[]; relationships: ClientRelationship[] };
};

export const doNothing = (): DoNothingAction => {
  return { type: DO_NOTHING };
};

export const resetAll = (views: Set<string>, state: State): ResetAllAction => {
  return { type: RESET_ALL, payload: { views, state } };
};

export const destroyItemRevert = (
  payload: DestroyItemRevertAction["payload"]
): DestroyItemRevertAction => ({
  type: DESTROY_ITEM_REVERT,
  payload,
});
