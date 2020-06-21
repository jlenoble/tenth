import { SET_ORDERS, ADD_TO_ORDER, REMOVE_FROM_ORDER } from "./consts";
import {
  SetOrdersAction,
  AddToOrderAction,
  RemoveFromOrderAction,
} from "./actions";
import { ItemId, Order, ClientRelationship } from "../../types";

export const setOrders = (payload: Order[]): SetOrdersAction => ({
  type: SET_ORDERS,
  payload,
});

export const addToOrder = (payload: {
  categoryId: ItemId;
  orderId: ItemId;
  relationships: ClientRelationship[];
}): AddToOrderAction => ({
  type: ADD_TO_ORDER,
  payload,
});

export const removeFromOrder = (payload: {
  categoryId: ItemId;
  orderId: ItemId;
  itemIds: ItemId[];
}): RemoveFromOrderAction => ({
  type: REMOVE_FROM_ORDER,
  payload,
});
