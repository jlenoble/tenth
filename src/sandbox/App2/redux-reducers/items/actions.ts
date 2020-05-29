import { SET_ITEMS } from "./consts";
import { GQLItem } from "../../types";

export type SetItemsAction = {
  type: typeof SET_ITEMS;
  payload: GQLItem[];
};

export type ItemsAction = SetItemsAction;
