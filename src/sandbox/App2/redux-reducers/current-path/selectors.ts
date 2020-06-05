import { ItemId, State } from "../../types";

export const getCurrentPath = (state: State): ItemId[] => {
  return state.currentPath;
};
