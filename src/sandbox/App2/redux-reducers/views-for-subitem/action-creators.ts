import { ItemId, ViewId } from "../../types";
import {
  ADD_VIEW_FOR_SUBITEM,
  REMOVE_VIEW_FOR_SUBITEM,
  ADD_VIEW_FOR_SUBITEMS,
  REMOVE_VIEW_FOR_SUBITEMS,
} from "./consts";
import {
  AddViewForSubItemAction,
  RemoveViewForSubItemAction,
  AddViewForSubItemsAction,
  RemoveViewForSubItemsAction,
} from "./actions";

export const addViewForSubItem = (
  viewId: ViewId,
  id: ItemId
): AddViewForSubItemAction => ({
  type: ADD_VIEW_FOR_SUBITEM,
  payload: { id, viewId },
});

export const removeViewForSubItem = (
  viewId: ViewId,
  id: ItemId
): RemoveViewForSubItemAction => ({
  type: REMOVE_VIEW_FOR_SUBITEM,
  payload: { id, viewId },
});

export const addViewForSubItems = (
  viewId: ViewId,
  ids: ItemId[]
): AddViewForSubItemsAction => ({
  type: ADD_VIEW_FOR_SUBITEMS,
  payload: { ids, viewId },
});

export const removeViewForSubItems = (
  viewId: ViewId,
  ids: ItemId[]
): RemoveViewForSubItemsAction => ({
  type: REMOVE_VIEW_FOR_SUBITEMS,
  payload: { ids, viewId },
});
