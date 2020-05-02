import {
  ManagerState,
  ManagerConsts,
  ManagerReducer,
  ManagerAnswerAction,
  VisibilityFilter
} from "./types";

export const makeManagerReducer = <T>(
  CONSTS: ManagerConsts
): ManagerReducer<T> => {
  const initialState: ManagerState<T> = {
    items: new Map(),
    selections: new Map(),
    visibilityFilter: VisibilityFilter.SHOW_ACTIVE
  };

  const {
    DO_CREATE,
    DO_DESTROY,
    DO_MODIFY,
    DO_SET,
    DO_CLEAR,
    DO_SET_VISIBILITY_FILTER,
    DO_EXPAND
  } = CONSTS;

  const reducer = (
    state = initialState,
    action?: ManagerAnswerAction<T>
  ): ManagerState<T> => {
    if (action) {
      switch (action.type) {
        case DO_CREATE: {
          const { itemId } = action;

          if (!state.items.has(itemId)) {
            const newItems = new Map(state.items);
            newItems.set(itemId, action.payload);
            return { ...state, items: newItems };
          }

          return state;
        }

        case DO_DESTROY: {
          const newItems = new Map(state.items);
          newItems.delete(action.itemId);
          return { ...state, items: newItems };
        }

        case DO_MODIFY: {
          const { itemId } = action;

          if (state.items.has(itemId)) {
            const payload = state.items.get(itemId)!;
            const newItems = new Map(state.items);
            newItems.set(itemId, { ...payload, ...action.payload });
            return { ...state, items: newItems };
          }

          return state;
        }

        case DO_SET: {
          const { items, selections } = action.payload;
          return {
            ...initialState,
            items: new Map(Object.entries(items)),
            selections: new Map(Object.entries(selections))
          };
        }

        case DO_CLEAR: {
          return initialState;
        }

        case DO_SET_VISIBILITY_FILTER: {
          return { ...state, visibilityFilter: action.visibilityFilter };
        }

        case DO_EXPAND: {
          const { itemId, expanded } = action;

          if (!state.selections.has(itemId) && expanded) {
            const newSelections = new Map(state.selections);
            newSelections.set(itemId, []);
            return { ...state, selections: newSelections };
          } else if (state.selections.has(itemId) && !expanded) {
            const newSelections = new Map(state.selections);
            newSelections.delete(itemId);
            return { ...state, selections: newSelections };
          }

          return state;
        }
      }
    }

    return state;
  };

  return reducer;
};
