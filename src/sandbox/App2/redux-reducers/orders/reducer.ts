import { Reducer } from "redux";
import {
  OrdersState as State,
  Order,
  ItemId,
  ClientRelationship,
} from "../../types";
import { SET_ORDERS, ADD_TO_ORDER, REMOVE_FROM_ORDER } from "./consts";
import { OrdersAction } from "./actions";

const initialState: State = new Map();

export const addToOrderReducer = (
  state: State,
  {
    categoryId,
    orderId,
    relationship: {
      id,
      ids: [leftId, relId, rightId],
    },
  }: {
    categoryId: ItemId;
    orderId: ItemId;
    relationship: ClientRelationship;
  }
): State => {
  const newState = new Map(state);

  const order = new Map(state.get(categoryId) || []);
  newState.set(categoryId, order);

  const itemIds = new Map(order.get(orderId) || []);
  order.set(orderId, itemIds);

  const left = itemIds.get(leftId) || {};
  const right = itemIds.get(rightId) || {};

  if (left.starts) {
    if (right.starts) {
    } else if (right.ends) {
    } else if (right.strictlyIncludedIn) {
    } else {
    }
  } else if (left.ends) {
    if (right.starts) {
    } else if (right.ends) {
    } else if (right.strictlyIncludedIn) {
    } else {
    }
  } else if (left.strictlyIncludedIn) {
    if (right.starts) {
    } else if (right.ends) {
    } else if (right.strictlyIncludedIn) {
    } else {
    }
  } else {
    if (right.starts) {
    } else if (right.ends) {
    } else if (right.strictlyIncludedIn) {
    } else {
    }
  }

  return newState;
};

export const removeFromOrderReducer = (
  state: State,
  order: { categoryId: ItemId; orderId: ItemId; itemIds: ItemId[] }
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
          const { categoryId, orderId, ids } = order;
          const orders = newState.get(categoryId) || new Map();
          orders.set(orderId, order);
          if (!newState.has(categoryId)) {
            newState.set(categoryId, orders);
          }
        });
        return newState;
      }

      case ADD_TO_ORDER: {
        return addToOrderReducer(state, action.payload);
      }

      case REMOVE_FROM_ORDER: {
        return removeFromOrderReducer(state, action.payload);
      }

      default:
        return state;
    }
  }

  return state;
}) as Reducer<State>;
