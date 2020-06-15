import { Data, MaybePreOptimisticAction } from "../../../types";
import { TRIGGER_UPDATE_RELATIONSHIP } from "./consts";
import { TriggerUpdateRelationshipAction } from "./actions";

export const triggerUpdateRelationship = (
  relationship: Data["updateRelationship"]["updateRelationship"],
  optimisticId?: number | null,
  error?: true
): MaybePreOptimisticAction<TriggerUpdateRelationshipAction> => ({
  type: TRIGGER_UPDATE_RELATIONSHIP,
  payload: relationship,
  meta: {
    optimisticId,
    error,
  },
});
