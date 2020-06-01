import { ItemId, ClientRelationship } from "../../types";

import {
  ADD_RELATIONSHIP_FOR_ITEM,
  REMOVE_RELATIONSHIP_FOR_ITEM,
  ADD_RELATIONSHIPS_FOR_ITEM,
  REMOVE_RELATIONSHIPS_FOR_ITEM,
  REMOVE_ALL_RELATIONSHIPS_FOR_ITEM,
} from "./consts";

import {
  AddRelationshipForItemAction,
  RemoveRelationshipForItemAction,
  AddRelationshipsForItemAction,
  RemoveRelationshipsForItemAction,
  RemoveAllRelationshipsForItemAction,
} from "./actions";

export const addRelationshipForItem = (
  relationship: ClientRelationship
): AddRelationshipForItemAction => ({
  type: ADD_RELATIONSHIP_FOR_ITEM,
  payload: relationship,
});

export const removeRelationshipForItem = (
  relationship: ClientRelationship
): RemoveRelationshipForItemAction => ({
  type: REMOVE_RELATIONSHIP_FOR_ITEM,
  payload: relationship,
});

export const addRelationshipsForItem = (
  relationships: ClientRelationship[]
): AddRelationshipsForItemAction => ({
  type: ADD_RELATIONSHIPS_FOR_ITEM,
  payload: relationships,
});

export const removeRelationshipsForItem = (
  relationships: ClientRelationship[]
): RemoveRelationshipsForItemAction => ({
  type: REMOVE_RELATIONSHIPS_FOR_ITEM,
  payload: relationships,
});

export const removeAllRelationshipsForItem = (
  id: ItemId
): RemoveAllRelationshipsForItemAction => ({
  type: REMOVE_ALL_RELATIONSHIPS_FOR_ITEM,
  payload: id,
});
