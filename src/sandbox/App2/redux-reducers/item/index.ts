import { ItemId, GQLItem } from "../../types";
import { ADD, REMOVE } from "./consts";
import { Action } from "./actions";

const initialState: Map<ItemId, GQLItem> = new Map();

export const itemReducer = (
  state = initialState,
  action: Action
): typeof initialState => {
  if (action) {
    switch (action.type) {
      case ADD: {
        const item = action.item;
        const id = item.id;

        if (state.has(id)) {
          return state;
        }

        const newState = new Map(state);
        newState.set(id, item);

        return newState;
      }

      case REMOVE: {
        const id = action.id;

        if (!state.has(id)) {
          return state;
        }

        const newState = new Map(state);
        newState.delete(id);

        return newState;
      }

      default:
        return state;
    }
  }

  return state;
};
