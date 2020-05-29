import { ensureState } from "redux-optimistic-ui";
import { GQLItem, State } from "../../types";

export const getItems = (state: State): GQLItem[] => {
  return Array.from(ensureState(state.items).values());
};
