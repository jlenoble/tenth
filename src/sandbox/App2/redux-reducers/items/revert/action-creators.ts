import { REVERT_DESTROY_ITEM, REVERT_UPDATE_ITEM } from "./consts";
import { RevertDestroyItemAction, RevertUpdateItemAction } from "./actions";

export const revertDestroyItem = (
  payload: RevertDestroyItemAction["payload"]
): RevertDestroyItemAction => ({
  type: REVERT_DESTROY_ITEM,
  payload,
});

export const revertUpdateItem = (
  payload: RevertUpdateItemAction["payload"]
): RevertUpdateItemAction => ({
  type: REVERT_UPDATE_ITEM,
  payload,
});
