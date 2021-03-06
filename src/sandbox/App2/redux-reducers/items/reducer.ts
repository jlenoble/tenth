import { Reducer } from "redux";
import { ItemsState as State } from "../../types";
import {
  SET_ITEMS,
  ADD_ITEM,
  REMOVE_ITEM,
  ADD_ITEMS,
  REMOVE_ITEMS,
  UPDATE_ITEM,
} from "./consts";
import { ItemsAction } from "./actions";

const initialState: State = new Map();

export const itemsReducer: Reducer<State> = ((
  state = initialState,
  action: ItemsAction
): State => {
  if (action) {
    switch (action.type) {
      case SET_ITEMS: {
        return new Map(action.payload.map((item) => [item.id, item]));
      }

      case ADD_ITEM: {
        if (!state.has(action.payload.id)) {
          const newState = new Map(state);
          newState.set(action.payload.id, action.payload);
          return newState;
        }
        break;
      }

      case REMOVE_ITEM: {
        if (state.has(action.payload)) {
          const newState = new Map(state);
          newState.delete(action.payload);
          return newState;
        }
        break;
      }

      case ADD_ITEMS: {
        const items = action.payload.filter(({ id }) => !state.has(id));

        if (items.length) {
          const newState = new Map(state);
          items.forEach((item) => newState.set(item.id, item));
          return newState;
        }

        break;
      }

      case REMOVE_ITEMS: {
        const items = action.payload.filter((id) => state.has(id));

        if (items.length) {
          const newState = new Map(state);
          items.forEach((id) => newState.delete(id));
          return newState;
        }

        break;
      }

      case UPDATE_ITEM: {
        const item = state.get(action.payload.id);

        if (item) {
          const newState = new Map(state);
          newState.set(item.id, { ...item, ...action.payload });
          return newState;
        }

        break;
      }

      default:
        return state;
    }
  }

  return state;
}) as Reducer<State>;
