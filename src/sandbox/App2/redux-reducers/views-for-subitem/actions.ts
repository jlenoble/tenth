import { ADD_VIEW_FOR_SUBITEM, REMOVE_VIEW_FOR_SUBITEM } from "./consts";
import { ViewForSubItem } from "../../types";

export type AddViewForSubItemAction = {
  type: typeof ADD_VIEW_FOR_SUBITEM;
  payload: ViewForSubItem;
};

export type RemoveViewForSubItemAction = {
  type: typeof REMOVE_VIEW_FOR_SUBITEM;
  payload: ViewForSubItem;
};

export type ViewsForSubItemAction =
  | AddViewForSubItemAction
  | RemoveViewForSubItemAction;
