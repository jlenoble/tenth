import { ensureState } from "redux-optimistic-ui";
import { ClientRelationship, State } from "../../types";

export const getRelationships = (state: State): ClientRelationship[] => {
  return Array.from(ensureState(state.relationships).values());
};
