import { GQLItem } from "../../types";
import { SET_ITEMS } from "./consts";
import { SetItemsAction } from "./actions";

export const setItems = (items: GQLItem[]): SetItemsAction => ({
  type: SET_ITEMS,
  payload: items,
});
