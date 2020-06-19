import { Reducer } from "redux";
import { OrdersState as State, Order, ItemId } from "../../types";
import {
  SET_ORDERS,
  ADD_ORDER,
  REMOVE_ORDER,
  ADD_ORDERS,
  REMOVE_ORDERS,
  UPDATE_ORDER,
  INSERT_ITEM_AFTER,
} from "./consts";
import { OrdersAction } from "./actions";

const initialState: State = new Map();

export const addOrderReducer = (state: State, order: Order): State => {
  const { itemId, orderId } = order;

  if (state.get(itemId)?.has(orderId)) {
    return state;
  }

  const newState = new Map(state);

  const orders = newState.get(itemId) || new Map();
  orders.set(orderId, order);
  if (!newState.has(itemId)) {
    newState.set(itemId, orders);
  }

  return newState;
};

export const removeOrderReducer = (
  state: State,
  order: { itemId: ItemId; orderId: ItemId }
): State => {
  const { itemId, orderId } = order;
  const orders = state.get(itemId);

  if (!orders || !orders.has(orderId)) {
    return state;
  }

  const newState = new Map(state);

  if (orders.size < 2) {
    newState.delete(itemId);
    return newState;
  }

  const newOrders = new Map(orders);
  newOrders.delete(orderId);
  newState.set(itemId, newOrders);

  return newState;
};

export const updateOrderReducer = (state: State, order: Order): State => {
  const { itemId, orderId } = order;
  const orders = state.get(itemId);

  if (!orders || !orders.has(orderId)) {
    return state;
  }

  const newState = new Map(state);
  const newOrders = new Map(orders);
  newOrders.set(orderId, order);
  newState.set(itemId, newOrders);

  return newState;
};

export const ordersReducer: Reducer<State> = ((
  state = initialState,
  action: OrdersAction
): State => {
  if (action) {
    switch (action.type) {
      case SET_ORDERS: {
        const newState = new Map();
        action.payload.forEach((order) => {
          const { itemId, orderId } = order;
          const orders = newState.get(itemId) || new Map();
          orders.set(orderId, order);
          if (!newState.has(itemId)) {
            newState.set(itemId, orders);
          }
        });
        return newState;
      }

      case ADD_ORDER: {
        return addOrderReducer(state, action.payload);
      }

      case REMOVE_ORDER: {
        return removeOrderReducer(state, action.payload);
      }

      case ADD_ORDERS: {
        return action.payload.reduce(addOrderReducer, state);
      }

      case REMOVE_ORDERS: {
        return action.payload.reduce(removeOrderReducer, state);
      }

      case UPDATE_ORDER: {
        return updateOrderReducer(state, action.payload);
      }

      case INSERT_ITEM_AFTER: {
        const { beforeId, afterId, itemId, orderId } = action.payload;
        const order = state.get(itemId)?.get(orderId);

        if (order) {
          const index = order.ids.findIndex((_id) => beforeId === _id);
          const newIds = order.ids
            .slice(0, index)
            .concat(afterId)
            .concat(order.ids.slice(index + 1));

          return updateOrderReducer(state, { ...order, ids: newIds });
        }

        break;
      }

      default:
        return state;
    }
  }

  return state;
}) as Reducer<State>;
