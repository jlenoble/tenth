import { ensureState } from "redux-optimistic-ui";
import { ClientItem, State } from "../../types";

export const getItems = (state: State): ClientItem[] => {
  return Array.from(ensureState(state.items).values());
};
