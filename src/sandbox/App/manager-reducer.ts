import { ManagerState } from "./types";
import { ManagerConsts } from "./manager-constants";
import { ManagerDoAction } from "./manager-action-creators";

export type ManagerReducer<T> = (
  state?: ManagerState<T>,
  action?: ManagerDoAction<T>
) => ManagerState<T>;

export const makeManagerReducer = <T>(
  CONSTS: ManagerConsts
): ManagerReducer<T> => {
  const initialState: ManagerState<T> = new Map();
  const {
    DO_CREATE,
    DO_DESTROY,
    DO_MODIFY,
    DO_SET,
    DO_CLEAR,
    DO_MOVE
  } = CONSTS;

  const reducer = (state = initialState, action?: ManagerDoAction<T>) => {
    if (action) {
      switch (action.type) {
        case DO_CREATE: {
          const { itemId } = action;
          const newState = new Map(state);
          newState.set(itemId, action.payload);
          return newState;
        }

        case DO_DESTROY: {
          const newState = new Map(state);
          newState.delete(action.itemId);
          return newState;
        }

        case DO_MODIFY: {
          const { itemId } = action;
          const payload = state.get(itemId)!;
          const newState = new Map(state);
          newState.set(itemId, { ...payload, ...action.payload });
          return newState;
        }

        case DO_SET: {
          return new Map(Object.entries(action.payload));
        }

        case DO_CLEAR: {
          return new Map();
        }
      }
    }

    return state;
  };

  return reducer;
};
