import { ClientRelationship, State, RelationshipId } from "../../types";

export const getRelationship = (id: RelationshipId) => (
  state: State
): ClientRelationship | undefined => {
  return state.relationships.get(id);
};

export const getRelationships = (state: State): ClientRelationship[] => {
  return Array.from(state.relationships.values());
};
