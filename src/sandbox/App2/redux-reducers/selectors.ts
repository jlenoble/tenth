import { getCurrentPath } from "./current-path";
import { getNCards } from "./ncards";
import { ItemId, State } from "../types";

export const getCurrentPathAndNCards = (
  state: State
): { nCards: number; currentPath: ItemId[] } => {
  return { nCards: getNCards(state), currentPath: getCurrentPath(state) };
};
