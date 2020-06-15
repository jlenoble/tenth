import { Data } from "../../../types";
import { TRIGGER_UPDATE_RELATIONSHIP } from "./consts";

export type TriggerUpdateRelationshipAction = {
  type: typeof TRIGGER_UPDATE_RELATIONSHIP;
  payload: Data["updateRelationship"]["updateRelationship"];
};
