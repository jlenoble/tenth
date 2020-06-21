import { SET_ORDERS, ADD_TO_ORDER, REMOVE_FROM_ORDER } from "./consts";
import { ItemId, Order, ClientRelationship } from "../../types";

export type SetOrdersAction = {
  type: typeof SET_ORDERS;
  payload: Order[];
};

export type AddToOrderAction = {
  type: typeof ADD_TO_ORDER;
  payload: {
    categoryId: ItemId;
    orderId: ItemId;
    relationships: ClientRelationship[];
  };
};

export type RemoveFromOrderAction = {
  type: typeof REMOVE_FROM_ORDER;
  payload: { categoryId: ItemId; orderId: ItemId; itemIds: ItemId[] };
};

export type OrdersAction =
  | SetOrdersAction
  | AddToOrderAction
  | RemoveFromOrderAction;
