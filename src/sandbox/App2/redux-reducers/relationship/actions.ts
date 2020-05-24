import {
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
} from "./consts";
import { ItemId } from "../../types";

type Ids = [ItemId, ItemId, ItemId];

export type AddRelationshipAction = {
  type: typeof ADD_RELATIONSHIP;
  ids: Ids;
};

export type RemoveRelationshipAction = {
  type: typeof REMOVE_RELATIONSHIP;
  ids: Ids;
};

export type AddRelationshipsAction = {
  type: typeof ADD_RELATIONSHIPS;
  relationships: Ids[];
};

export type RemoveRelationshipsAction = {
  type: typeof REMOVE_RELATIONSHIPS;
  relationships: Ids[];
};

export type RelationshipAction =
  | AddRelationshipAction
  | RemoveRelationshipAction
  | AddRelationshipsAction
  | RemoveRelationshipsAction;
