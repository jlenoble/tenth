import { ensureState } from "redux-optimistic-ui";
import { State } from "../../types";

export const getNCards = (state: State): number => {
  return ensureState(state.nCards);
};
