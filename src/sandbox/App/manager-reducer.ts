import {
  ManagerState,
  ManagerConsts,
  ManagerReducer,
  ManagerAnswerAction
} from "./types";

export const makeManagerReducer = <T>(
  CONSTS: ManagerConsts
): ManagerReducer<T> => {
  const initialState: ManagerState<T> = {
    items: new Map(),
    selections: new Map()
  };

  const { DO_CREATE, DO_DESTROY, DO_MODIFY, DO_SET, DO_CLEAR } = CONSTS;

  const reducer = (
    state = initialState,
    action?: ManagerAnswerAction<T>
  ): ManagerState<T> => {
    if (action) {
      switch (action.type) {
        case DO_CREATE: {
          const { itemId } = action;
          const newItems = new Map(state.items);
          newItems.set(itemId, action.payload);
          return { ...state, items: newItems };
        }

        case DO_DESTROY: {
          const newItems = new Map(state.items);
          newItems.delete(action.itemId);
          return { ...state, items: newItems };
        }

        case DO_MODIFY: {
          const { itemId } = action;
          const payload = state.items.get(itemId)!;
          const newItems = new Map(state.items);
          newItems.set(itemId, { ...payload, ...action.payload });
          return { ...state, items: newItems };
        }

        case DO_SET: {
          const { items, selections } = action.payload;
          return {
            items: new Map(Object.entries(items)),
            selections: new Map(Object.entries(selections))
          };
        }

        case DO_CLEAR: {
          return initialState;
        }
      }
    }

    return state;
  };

  return reducer;
};
