import {
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
  CREATE_RELATED_ITEM,
  DESTROY_ITEM,
} from "./consts";
import { ItemId, Data } from "../../types";

type Ids = [ItemId, ItemId, ItemId];

export type AddRelationshipAction = {
  type: typeof ADD_RELATIONSHIP;
  payload: Ids;
};

export type RemoveRelationshipAction = {
  type: typeof REMOVE_RELATIONSHIP;
  payload: Ids;
};

export type AddRelationshipsAction = {
  type: typeof ADD_RELATIONSHIPS;
  payload: Ids[];
};

export type RemoveRelationshipsAction = {
  type: typeof REMOVE_RELATIONSHIPS;
  payload: Ids[];
};

export type createRelatedItemAction = {
  type: typeof CREATE_RELATED_ITEM;
  payload: Data["createRelatedItem"]["createRelatedItem"];
};

export type destroyItemAction = {
  type: typeof DESTROY_ITEM;
  payload: Data["destroyItem"]["destroyItem"];
};

export type RelationshipAction =
  | AddRelationshipAction
  | RemoveRelationshipAction
  | AddRelationshipsAction
  | RemoveRelationshipsAction
  | createRelatedItemAction
  | destroyItemAction;
