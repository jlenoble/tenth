import {
  SET_ITEMS,
  ADD_ITEM,
  REMOVE_ITEM,
  ADD_ITEMS,
  REMOVE_ITEMS,
} from "./consts";
import { ClientItem, ItemId } from "../../types";

export type SetItemsAction = {
  type: typeof SET_ITEMS;
  payload: ClientItem[];
};

export type AddItemAction = {
  type: typeof ADD_ITEM;
  payload: ClientItem;
};

export type RemoveItemAction = {
  type: typeof REMOVE_ITEM;
  payload: ItemId;
};

export type AddItemsAction = {
  type: typeof ADD_ITEMS;
  payload: ClientItem[];
};

export type RemoveItemsAction = {
  type: typeof REMOVE_ITEMS;
  payload: ItemId[];
};

export type ItemsAction =
  | SetItemsAction
  | AddItemAction
  | RemoveItemAction
  | AddItemsAction
  | RemoveItemsAction;
