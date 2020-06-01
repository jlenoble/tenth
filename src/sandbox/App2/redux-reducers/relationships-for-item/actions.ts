import {
  ADD_RELATIONSHIP_FOR_ITEM,
  REMOVE_RELATIONSHIP_FOR_ITEM,
  ADD_RELATIONSHIPS_FOR_ITEM,
  REMOVE_RELATIONSHIPS_FOR_ITEM,
} from "./consts";
import { ClientRelationship } from "../../types";

export type AddRelationshipForItemAction = {
  type: typeof ADD_RELATIONSHIP_FOR_ITEM;
  payload: ClientRelationship;
};

export type RemoveRelationshipForItemAction = {
  type: typeof REMOVE_RELATIONSHIP_FOR_ITEM;
  payload: ClientRelationship;
};

export type AddRelationshipsForItemAction = {
  type: typeof ADD_RELATIONSHIPS_FOR_ITEM;
  payload: ClientRelationship[];
};

export type RemoveRelationshipsForItemAction = {
  type: typeof REMOVE_RELATIONSHIPS_FOR_ITEM;
  payload: ClientRelationship[];
};

export type RelationshipsForItemAction =
  | AddRelationshipForItemAction
  | RemoveRelationshipForItemAction
  | AddRelationshipsForItemAction
  | RemoveRelationshipsForItemAction;
