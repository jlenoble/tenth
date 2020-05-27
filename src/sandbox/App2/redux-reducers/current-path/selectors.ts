import { ensureState } from "redux-optimistic-ui";
import { ItemId, State } from "../../types";

export const getCurrentPath = (state: State): ItemId[] => {
  return ensureState(state.currentPath);
};
