import { GQLRelationship } from "../../types";
import { SET_RELATIONSHIPS } from "./consts";
import { SetRelationshipsAction } from "./actions";

export const setRelationships = (
  relationships: GQLRelationship[]
): SetRelationshipsAction => ({
  type: SET_RELATIONSHIPS,
  payload: relationships,
});
