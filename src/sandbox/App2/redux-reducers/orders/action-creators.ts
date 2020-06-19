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
import { ItemId, Order } from "../../types";

export const setOrders = (payload: Order[]): SetOrdersAction => ({
  type: SET_ORDERS,
  payload,
});

export const addOrder = (payload: Order): AddOrderAction => ({
  type: ADD_ORDER,
  payload,
});

export const removeOrder = (payload: {
  itemId: ItemId;
  orderId: ItemId;
}): RemoveOrderAction => ({
  type: REMOVE_ORDER,
  payload,
});

export const addOrders = (payload: Order[]): AddOrdersAction => ({
  type: ADD_ORDERS,
  payload,
});

export const removeOrders = (
  payload: { itemId: ItemId; orderId: ItemId }[]
): RemoveOrdersAction => ({
  type: REMOVE_ORDERS,
  payload,
});

export const updateOrder = (payload: Order): UpdateOrderAction => ({
  type: UPDATE_ORDER,
  payload,
});

export const insertItemAfter = (payload: {
  itemId: ItemId;
  orderId: ItemId;
  beforeId: ItemId;
  afterId: ItemId;
}): InsertItemAfterAction => ({
  type: INSERT_ITEM_AFTER,
  payload,
});
