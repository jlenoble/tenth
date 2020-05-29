import { ensureState } from "redux-optimistic-ui";
import { GQLRelationship, State } from "../../types";

export const getRelationships = (state: State): GQLRelationship[] => {
  return Array.from(ensureState(state.relationships).values());
};
