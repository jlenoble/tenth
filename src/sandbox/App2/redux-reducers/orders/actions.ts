import {
  SET_ORDERS,
  ADD_ORDER,
  REMOVE_ORDER,
  ADD_ORDERS,
  REMOVE_ORDERS,
  UPDATE_ORDER,
  INSERT_ITEM_AFTER,
} from "./consts";
import { ItemId } from "../../types";

export type SetOrdersAction = {
  type: typeof SET_ORDERS;
  payload: { id: ItemId; ids: ItemId[] }[];
};

export type AddOrderAction = {
  type: typeof ADD_ORDER;
  payload: { id: ItemId; ids: ItemId[] };
};

export type RemoveOrderAction = {
  type: typeof REMOVE_ORDER;
  payload: ItemId;
};

export type AddOrdersAction = {
  type: typeof ADD_ORDERS;
  payload: { id: ItemId; ids: ItemId[] }[];
};

export type RemoveOrdersAction = {
  type: typeof REMOVE_ORDERS;
  payload: ItemId[];
};

export type UpdateOrderAction = {
  type: typeof UPDATE_ORDER;
  payload: { id: ItemId; ids: ItemId[] };
};

export type InsertItemAfterAction = {
  type: typeof INSERT_ITEM_AFTER;
  payload: { id: ItemId; beforeId: ItemId; afterId: ItemId };
};

export type OrdersAction =
  | SetOrdersAction
  | AddOrderAction
  | RemoveOrderAction
  | AddOrdersAction
  | RemoveOrdersAction
  | UpdateOrderAction
  | InsertItemAfterAction;
