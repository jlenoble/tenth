import {
  SET_RELATIONSHIPS,
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  UPDATE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
} from "./consts";
import { ClientRelationship, RelationshipId } from "../../types";

export type SetRelationshipsAction = {
  type: typeof SET_RELATIONSHIPS;
  payload: ClientRelationship[];
};

export type AddRelationshipAction = {
  type: typeof ADD_RELATIONSHIP;
  payload: ClientRelationship;
};

export type RemoveRelationshipAction = {
  type: typeof REMOVE_RELATIONSHIP;
  payload: RelationshipId;
};

export type UpdateRelationshipAction = {
  type: typeof UPDATE_RELATIONSHIP;
  payload: ClientRelationship;
};

export type AddRelationshipsAction = {
  type: typeof ADD_RELATIONSHIPS;
  payload: ClientRelationship[];
};

export type RemoveRelationshipsAction = {
  type: typeof REMOVE_RELATIONSHIPS;
  payload: RelationshipId[];
};

export type RelationshipsAction =
  | SetRelationshipsAction
  | AddRelationshipAction
  | RemoveRelationshipAction
  | UpdateRelationshipAction
  | AddRelationshipsAction
  | RemoveRelationshipsAction;
