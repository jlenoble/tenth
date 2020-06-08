import { Data, MaybePreOptimisticAction } from "../../../types";
import { CREATE_RELATED_ITEM, DESTROY_ITEM, UPDATE_ITEM } from "./consts";
import {
  CreateRelatedItemAction,
  DestroyItemAction,
  UpdateItemAction,
} from "./actions";

export const createRelatedItem = (
  item: Data["createRelatedItem"]["createRelatedItem"],
  optimisticId?: number,
  error?: true
): MaybePreOptimisticAction<CreateRelatedItemAction> => ({
  type: CREATE_RELATED_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});

export const destroyItem = (
  item: Data["destroyItem"]["destroyItem"],
  optimisticId?: number | null,
  error?: true
): MaybePreOptimisticAction<DestroyItemAction> => ({
  type: DESTROY_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});

export const updateItem = (
  item: Data["updateItem"]["updateItem"],
  optimisticId?: number | null,
  error?: true
): MaybePreOptimisticAction<UpdateItemAction> => ({
  type: UPDATE_ITEM,
  payload: item,
  meta: {
    optimisticId,
    error,
  },
});
