import {
  SET_ORDERS,
  ADD_ORDER,
  REMOVE_ORDER,
  ADD_ORDERS,
  REMOVE_ORDERS,
  UPDATE_ORDER,
  INSERT_ITEM_AFTER,
} from "./consts";
import {
  SetOrdersAction,
  AddOrderAction,
  RemoveOrderAction,
  AddOrdersAction,
  RemoveOrdersAction,
  UpdateOrderAction,
  InsertItemAfterAction,
} from "./actions";
import { ItemId } from "../../types";

export const setOrders = (
  payload: { id: ItemId; ids: ItemId[] }[]
): SetOrdersAction => ({
  type: SET_ORDERS,
  payload,
});

export const addOrder = (payload: {
  id: ItemId;
  ids: ItemId[];
}): AddOrderAction => ({
  type: ADD_ORDER,
  payload,
});

export const removeOrder = (payload: ItemId): RemoveOrderAction => ({
  type: REMOVE_ORDER,
  payload,
});

export const addOrders = (
  payload: { id: ItemId; ids: ItemId[] }[]
): AddOrdersAction => ({
  type: ADD_ORDERS,
  payload,
});

export const removeOrders = (payload: ItemId[]): RemoveOrdersAction => ({
  type: REMOVE_ORDERS,
  payload,
});

export const updateOrder = (payload: {
  id: ItemId;
  ids: ItemId[];
}): UpdateOrderAction => ({
  type: UPDATE_ORDER,
  payload,
});

export const insertItemAfter = (payload: {
  id: ItemId;
  beforeId: ItemId;
  afterId: ItemId;
}): InsertItemAfterAction => ({
  type: INSERT_ITEM_AFTER,
  payload,
});
