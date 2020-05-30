import { ItemId, ViewId } from "../../types";
import { ADD_VIEW_FOR_ITEM, REMOVE_VIEW_FOR_ITEM } from "./consts";
import { AddViewForItemAction, RemoveViewForItemAction } from "./actions";

export const addViewForItem = (
  viewId: ViewId,
  id: ItemId
): AddViewForItemAction => ({
  type: ADD_VIEW_FOR_ITEM,
  payload: { id, viewId },
});

export const removeViewForItem = (
  viewId: ViewId,
  id: ItemId
): RemoveViewForItemAction => ({
  type: REMOVE_VIEW_FOR_ITEM,
  payload: { id, viewId },
});
