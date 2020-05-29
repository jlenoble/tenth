import { ItemId, ViewId } from "../../types";
import { ADD_VIEW_FOR_SUBITEM, REMOVE_VIEW_FOR_SUBITEM } from "./consts";
import { AddViewForSubItemAction, RemoveViewForSubItemAction } from "./actions";

export const addViewForSubItem = (
  id: ItemId,
  viewId: ViewId
): AddViewForSubItemAction => ({
  type: ADD_VIEW_FOR_SUBITEM,
  payload: { id, viewId },
});

export const removeViewForSubItem = (
  id: ItemId,
  viewId: ViewId
): RemoveViewForSubItemAction => ({
  type: REMOVE_VIEW_FOR_SUBITEM,
  payload: { id, viewId },
});
