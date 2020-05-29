import { ADD_VIEW_FOR_ITEM, REMOVE_VIEW_FOR_ITEM } from "./consts";
import { ViewForItem } from "../../types";

export type AddViewForItemAction = {
  type: typeof ADD_VIEW_FOR_ITEM;
  payload: ViewForItem;
};

export type RemoveViewForItemAction = {
  type: typeof REMOVE_VIEW_FOR_ITEM;
  payload: ViewForItem;
};

export type ViewsForItemAction = AddViewForItemAction | RemoveViewForItemAction;
