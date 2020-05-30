import {
  ADD_VIEW_FOR_SUBITEM,
  REMOVE_VIEW_FOR_SUBITEM,
  ADD_VIEW_FOR_SUBITEMS,
  REMOVE_VIEW_FOR_SUBITEMS,
} from "./consts";
import { ViewForSubItem, ViewForSubItems } from "../../types";

export type AddViewForSubItemAction = {
  type: typeof ADD_VIEW_FOR_SUBITEM;
  payload: ViewForSubItem;
};

export type RemoveViewForSubItemAction = {
  type: typeof REMOVE_VIEW_FOR_SUBITEM;
  payload: ViewForSubItem;
};

export type AddViewForSubItemsAction = {
  type: typeof ADD_VIEW_FOR_SUBITEMS;
  payload: ViewForSubItems;
};

export type RemoveViewForSubItemsAction = {
  type: typeof REMOVE_VIEW_FOR_SUBITEMS;
  payload: ViewForSubItems;
};

export type ViewsForSubItemAction =
  | AddViewForSubItemAction
  | RemoveViewForSubItemAction
  | AddViewForSubItemsAction
  | RemoveViewForSubItemsAction;
