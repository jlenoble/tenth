import {
  ADD_VIEW_FOR_ITEM,
  REMOVE_VIEW_FOR_ITEM,
  REMOVE_ALL_VIEWS_FOR_ITEM,
} from "./consts";
import { ItemId, ViewForItem } from "../../types";

export type AddViewForItemAction = {
  type: typeof ADD_VIEW_FOR_ITEM;
  payload: ViewForItem;
};

export type RemoveViewForItemAction = {
  type: typeof REMOVE_VIEW_FOR_ITEM;
  payload: ViewForItem;
};

export type RemoveAllViewsForItemAction = {
  type: typeof REMOVE_ALL_VIEWS_FOR_ITEM;
  payload: ItemId;
};

export type ViewsForItemAction =
  | AddViewForItemAction
  | RemoveViewForItemAction
  | RemoveAllViewsForItemAction;
