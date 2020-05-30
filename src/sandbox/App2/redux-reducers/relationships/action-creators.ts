import {
  SET_RELATIONSHIPS,
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
} from "./consts";
import {
  SetRelationshipsAction,
  AddRelationshipAction,
  RemoveRelationshipAction,
  AddRelationshipsAction,
  RemoveRelationshipsAction,
} from "./actions";
import { ClientRelationship, RelationshipId } from "../../types";

export const setRelationships = (
  relationships: ClientRelationship[]
): SetRelationshipsAction => ({
  type: SET_RELATIONSHIPS,
  payload: relationships,
});

export const addRelationship = (
  relationship: ClientRelationship
): AddRelationshipAction => ({
  type: ADD_RELATIONSHIP,
  payload: relationship,
});

export const removeRelationship = (
  relationshipId: RelationshipId
): RemoveRelationshipAction => ({
  type: REMOVE_RELATIONSHIP,
  payload: relationshipId,
});

export const addRelationships = (
  relationships: ClientRelationship[]
): AddRelationshipsAction => ({
  type: ADD_RELATIONSHIPS,
  payload: relationships,
});

export const removeRelationships = (
  relationshipIds: RelationshipId[]
): RemoveRelationshipsAction => ({
  type: REMOVE_RELATIONSHIPS,
  payload: relationshipIds,
});
