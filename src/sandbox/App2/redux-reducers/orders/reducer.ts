import { Reducer } from "redux";
import { OrdersState as State } from "../../types";
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

export const ordersReducer: Reducer<State> = ((
  state = initialState,
  action: OrdersAction
): State => {
  if (action) {
    switch (action.type) {
      case SET_ORDERS: {
        return new Map(action.payload.map(({ id, ids }) => [id, ids]));
      }

      case ADD_ORDER: {
        if (!state.has(action.payload.id)) {
          const newState = new Map(state);
          newState.set(action.payload.id, action.payload.ids);
          return newState;
        }
        break;
      }

      case REMOVE_ORDER: {
        if (state.has(action.payload)) {
          const newState = new Map(state);
          newState.delete(action.payload);
          return newState;
        }
        break;
      }

      case ADD_ORDERS: {
        const orders = action.payload.filter(({ id }) => !state.has(id));

        if (orders.length) {
          const newState = new Map(state);
          orders.forEach(({ id, ids }) => newState.set(id, ids));
          return newState;
        }

        break;
      }

      case REMOVE_ORDERS: {
        const orders = action.payload.filter((id) => state.has(id));

        if (orders.length) {
          const newState = new Map(state);
          orders.forEach((id) => newState.delete(id));
          return newState;
        }

        break;
      }

      case UPDATE_ORDER: {
        const { id, ids } = action.payload;

        if (state.has(id)) {
          const newState = new Map(state);
          newState.set(id, ids);
          return newState;
        }

        break;
      }

      case INSERT_ITEM_AFTER: {
        const { id, beforeId, afterId } = action.payload;
        const ids = state.get(id);

        if (ids) {
          const index = ids.findIndex((_id) => beforeId === _id);
          if (index !== -1) {
            const newState = new Map(state);
            newState.set(
              id,
              ids
                .slice(0, index)
                .concat(afterId)
                .concat(ids.slice(index + 1))
            );
            return newState;
          }
        }

        break;
      }

      default:
        return state;
    }
  }

  return state;
}) as Reducer<State>;
