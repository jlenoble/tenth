export * from "./current-path";
export * from "./items";
export * from "./ncards";
export * from "./relationships";
export * from "./relationships-for-item";
export * from "./views-for-item";
export * from "./views-for-subitem";
export * from "./selectors";

import { State } from "../types";

export const DO_NOTHING = "DO_NOTHING";
export const RESET_ALL = "RESET_ALL";

export type DoNothingAction = {
  type: typeof DO_NOTHING;
};

export type ResetAllAction = {
  type: typeof RESET_ALL;
  payload: { views: Set<string>; state: State };
};

export const doNothing = (): DoNothingAction => {
  return { type: DO_NOTHING };
};

export const resetAll = (views: Set<string>, state: State): ResetAllAction => {
  return { type: RESET_ALL, payload: { views, state } };
};
