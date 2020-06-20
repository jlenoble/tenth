import {
  SET_ORDERS,
  ADD_ORDER,
  REMOVE_ORDER,
  ADD_ORDERS,
  REMOVE_ORDERS,
  UPDATE_ORDER,
} from "./consts";
import {
  SetOrdersAction,
  AddOrderAction,
  RemoveOrderAction,
  AddOrdersAction,
  RemoveOrdersAction,
  UpdateOrderAction,
} from "./actions";
import { ItemId, Order, ClientRelationship } from "../../types";

export const setOrders = (payload: Order[]): SetOrdersAction => ({
  type: SET_ORDERS,
  payload,
});

export const addOrder = (payload: {
  itemId: ItemId;
  orderId: ItemId;
  relationships: ClientRelationship[];
}): AddOrderAction => ({
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

export const addOrders = (
  payload: {
    itemId: ItemId;
    orderId: ItemId;
    relationships: ClientRelationship[];
  }[]
): AddOrdersAction => ({
  type: ADD_ORDERS,
  payload,
});

export const removeOrders = (
  payload: { itemId: ItemId; orderId: ItemId }[]
): RemoveOrdersAction => ({
  type: REMOVE_ORDERS,
  payload,
});

export const updateOrder = (payload: {
  itemId: ItemId;
  orderId: ItemId;
  relationships: ClientRelationship[];
}): UpdateOrderAction => ({
  type: UPDATE_ORDER,
  payload,
});
