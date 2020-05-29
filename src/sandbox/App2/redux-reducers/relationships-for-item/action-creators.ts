import { Ids } from "../../types";
import {
  ADD_RELATIONSHIP_FOR_ITEM,
  REMOVE_RELATIONSHIP_FOR_ITEM,
  ADD_RELATIONSHIPS_FOR_ITEM,
  REMOVE_RELATIONSHIPS_FOR_ITEM,
} from "./consts";
import {
  AddRelationshipForItemAction,
  RemoveRelationshipForItemAction,
  AddRelationshipsForItemAction,
  RemoveRelationshipsForItemAction,
} from "./actions";

export const addRelationshipForItem = (
  ids: Ids
): AddRelationshipForItemAction => ({
  type: ADD_RELATIONSHIP_FOR_ITEM,
  payload: ids,
});

export const removeRelationshipForItem = (
  ids: Ids
): RemoveRelationshipForItemAction => ({
  type: REMOVE_RELATIONSHIP_FOR_ITEM,
  payload: ids,
});

export const addRelationshipsForItem = (
  relationships: Ids[]
): AddRelationshipsForItemAction => ({
  type: ADD_RELATIONSHIPS_FOR_ITEM,
  payload: relationships,
});

export const removeRelationshipsForItem = (
  relationships: Ids[]
): RemoveRelationshipsForItemAction => ({
  type: REMOVE_RELATIONSHIPS_FOR_ITEM,
  payload: relationships,
});
