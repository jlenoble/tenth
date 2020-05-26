import { Ids, Data } from "../../types";
import {
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
  CREATE_RELATED_ITEM,
  DESTROY_ITEM,
} from "./consts";
import {
  Meta,
  AddRelationshipAction,
  RemoveRelationshipAction,
  AddRelationshipsAction,
  RemoveRelationshipsAction,
  CreateRelatedItemAction,
  DestroyItemAction,
} from "./actions";

export const addRelationship = (ids: Ids): AddRelationshipAction => ({
  type: ADD_RELATIONSHIP,
  payload: ids,
});

export const removeRelationship = (ids: Ids): RemoveRelationshipAction => ({
  type: REMOVE_RELATIONSHIP,
  payload: ids,
});

export const addRelationships = (
  relationships: Ids[]
): AddRelationshipsAction => ({
  type: ADD_RELATIONSHIPS,
  payload: relationships,
});

export const removeRelationships = (
  relationships: Ids[]
): RemoveRelationshipsAction => ({
  type: REMOVE_RELATIONSHIPS,
  payload: relationships,
});

export const createRelatedItem = (
  item: Data["createRelatedItem"]["createRelatedItem"],
  meta: Meta
): CreateRelatedItemAction => ({
  type: CREATE_RELATED_ITEM,
  payload: item,
  meta,
});

export const destroyItem = (
  item: Data["destroyItem"]["destroyItem"],
  meta: Meta
): DestroyItemAction => ({
  type: DESTROY_ITEM,
  payload: item,
  meta,
});
