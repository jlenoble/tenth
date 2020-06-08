import {
  SET_ITEMS,
  ADD_ITEM,
  REMOVE_ITEM,
  ADD_ITEMS,
  REMOVE_ITEMS,
  UPDATE_ITEM,
} from "./consts";
import {
  SetItemsAction,
  AddItemAction,
  RemoveItemAction,
  AddItemsAction,
  RemoveItemsAction,
  UpdateItemsAction,
} from "./actions";
import { ClientItem, ItemId } from "../../types";

export const setItems = (items: ClientItem[]): SetItemsAction => ({
  type: SET_ITEMS,
  payload: items,
});

export const addItem = (item: ClientItem): AddItemAction => ({
  type: ADD_ITEM,
  payload: item,
});

export const removeItem = (itemId: ItemId): RemoveItemAction => ({
  type: REMOVE_ITEM,
  payload: itemId,
});

export const addItems = (items: ClientItem[]): AddItemsAction => ({
  type: ADD_ITEMS,
  payload: items,
});

export const removeItems = (itemIds: ItemId[]): RemoveItemsAction => ({
  type: REMOVE_ITEMS,
  payload: itemIds,
});

export const updateItem = (item: ClientItem): UpdateItemsAction => ({
  type: UPDATE_ITEM,
  payload: item,
});
