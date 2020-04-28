import { Action } from "redux";
import { ManagerState, Item } from "./types";
import { ManagerConsts } from "./manager-constants";

export const makeManagerReducer = <T>(CONSTS: ManagerConsts) => {
  const initialState: ManagerState<T> = new Map();
  const { DO_CREATE, DO_DESTROY, DO_MODIFY } = CONSTS;

  const reducer = (state = initialState, action?: Action & Item<T>) => {
    if (action) {
      const { type, itemId } = action;

      switch (type) {
        case DO_CREATE: {
          const newState = new Map(state);
          newState.set(itemId, { itemId, payload: action.payload });
          return newState;
        }

        case DO_DESTROY: {
          const newState = new Map(state);
          newState.delete(itemId);
          return newState;
        }

        case DO_MODIFY: {
          const { payload } = state.get(itemId)!;
          const newState = new Map(state);
          newState.set(itemId, {
            itemId,
            payload: { ...payload, ...action.payload }
          });
          return newState;
        }
      }
    }

    return state;
  };

  return reducer;
};
