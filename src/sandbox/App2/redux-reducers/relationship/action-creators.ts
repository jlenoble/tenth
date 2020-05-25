import { ItemId, Data } from "../../types";
import {
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
  CREATE_RELATED_ITEM,
  DESTROY_ITEM,
} from "./consts";
import { RelationshipAction } from "./actions";

type Ids = [ItemId, ItemId, ItemId];

export const addRelationship = (ids: Ids): RelationshipAction => ({
  type: ADD_RELATIONSHIP,
  payload: ids,
});

export const removeRelationship = (ids: Ids): RelationshipAction => ({
  type: REMOVE_RELATIONSHIP,
  payload: ids,
});

export const addRelationships = (relationships: Ids[]): RelationshipAction => ({
  type: ADD_RELATIONSHIPS,
  payload: relationships,
});

export const removeRelationships = (
  relationships: Ids[]
): RelationshipAction => ({
  type: REMOVE_RELATIONSHIPS,
  payload: relationships,
});

export const createRelatedItem = (
  item: Data["createRelatedItem"]["createRelatedItem"]
): RelationshipAction => ({
  type: CREATE_RELATED_ITEM,
  payload: item,
});

export const destroyItem = (
  item: Data["destroyItem"]["destroyItem"]
): RelationshipAction => ({
  type: DESTROY_ITEM,
  payload: item,
});
