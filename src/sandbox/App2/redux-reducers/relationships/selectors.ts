import { ClientRelationship, State } from "../../types";

export const getRelationships = (state: State): ClientRelationship[] => {
  return Array.from(state.relationships.values());
};
