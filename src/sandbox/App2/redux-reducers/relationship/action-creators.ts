import { ItemId } from "../../types";
import {
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
} from "./consts";
import { RelationshipAction } from "./actions";

type Ids = [ItemId, ItemId, ItemId];

export const addRelationship = (ids: Ids): RelationshipAction => ({
  type: ADD_RELATIONSHIP,
  ids,
});

export const removeRelationship = (ids: Ids): RelationshipAction => ({
  type: REMOVE_RELATIONSHIP,
  ids,
});

export const addRelationships = (relationships: Ids[]): RelationshipAction => ({
  type: ADD_RELATIONSHIPS,
  relationships,
});

export const removeRelationships = (
  relationships: Ids[]
): RelationshipAction => ({
  type: REMOVE_RELATIONSHIPS,
  relationships,
});
