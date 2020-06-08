import { Data, MaybePreOptimisticAction } from "../../../types";
import {
  TRIGGER_CREATE_RELATED_ITEM,
  TRIGGER_DESTROY_ITEM,
  TRIGGER_UPDATE_ITEM,
} from "./consts";
import {
  TriggerCreateRelatedItemAction,
  TriggerDestroyItemAction,
  TriggerUpdateItemAction,
} from "./actions";

export const triggerCreateRelatedItem = (
  item: Data["createRelatedItem"]["createRelatedItem"],
  optimisticId?: number,
  error?: true
): MaybePreOptimisticAction<TriggerCreateRelatedItemAction> => ({
  type: TRIGGER_CREATE_RELATED_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});

export const triggerDestroyItem = (
  item: Data["destroyItem"]["destroyItem"],
  optimisticId?: number | null,
  error?: true
): MaybePreOptimisticAction<TriggerDestroyItemAction> => ({
  type: TRIGGER_DESTROY_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});

export const triggerUpdateItem = (
  item: Data["updateItem"]["updateItem"],
  optimisticId?: number | null,
  error?: true
): MaybePreOptimisticAction<TriggerUpdateItemAction> => ({
  type: TRIGGER_UPDATE_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});
