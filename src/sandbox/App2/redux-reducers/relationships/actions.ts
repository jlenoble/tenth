import { SET_RELATIONSHIPS } from "./consts";
import { GQLRelationship } from "../../types";

export type SetRelationshipsAction = {
  type: typeof SET_RELATIONSHIPS;
  payload: GQLRelationship[];
};

export type RelationshipsAction = SetRelationshipsAction;
