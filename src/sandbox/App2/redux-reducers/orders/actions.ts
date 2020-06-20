import {
  SET_ORDERS,
  ADD_ORDER,
  REMOVE_ORDER,
  ADD_ORDERS,
  REMOVE_ORDERS,
  UPDATE_ORDER,
} from "./consts";
import { ItemId, Order, ClientRelationship } from "../../types";

export type SetOrdersAction = {
  type: typeof SET_ORDERS;
  payload: Order[];
};

export type AddOrderAction = {
  type: typeof ADD_ORDER;
  payload: {
    itemId: ItemId;
    orderId: ItemId;
    relationships: ClientRelationship[];
  };
};

export type RemoveOrderAction = {
  type: typeof REMOVE_ORDER;
  payload: { itemId: ItemId; orderId: ItemId };
};

export type AddOrdersAction = {
  type: typeof ADD_ORDERS;
  payload: {
    itemId: ItemId;
    orderId: ItemId;
    relationships: ClientRelationship[];
  }[];
};

export type RemoveOrdersAction = {
  type: typeof REMOVE_ORDERS;
  payload: { itemId: ItemId; orderId: ItemId }[];
};

export type UpdateOrderAction = {
  type: typeof UPDATE_ORDER;
  payload: {
    itemId: ItemId;
    orderId: ItemId;
    relationships: ClientRelationship[];
  };
};

export type OrdersAction =
  | SetOrdersAction
  | AddOrderAction
  | RemoveOrderAction
  | AddOrdersAction
  | RemoveOrdersAction
  | UpdateOrderAction;
