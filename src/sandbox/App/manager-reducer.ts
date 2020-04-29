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
  const initialState: ManagerState<T> = { items: new Map() };

  const {
    DO_CREATE,
    DO_DESTROY,
    DO_MODIFY,
    DO_SET,
    DO_CLEAR,
    DO_MOVE
  } = CONSTS;

  const reducer = (
    state = initialState,
    action?: ManagerDoAction<T>
  ): ManagerState<T> => {
    if (action) {
      switch (action.type) {
        case DO_CREATE: {
          const { itemId } = action;
          const newItems = new Map(state.items);
          newItems.set(itemId, action.payload);
          return { items: newItems };
        }

        case DO_DESTROY: {
          const newItems = new Map(state.items);
          newItems.delete(action.itemId);
          return { items: newItems };
        }

        case DO_MODIFY: {
          const { itemId } = action;
          const payload = state.items.get(itemId)!;
          const newItems = new Map(state.items);
          newItems.set(itemId, { ...payload, ...action.payload });
          return { items: newItems };
        }

        case DO_SET: {
          return { items: new Map(Object.entries(action.payload)) };
        }

        case DO_CLEAR: {
          return { items: new Map() };
        }
      }
    }

    return state;
  };

  return reducer;
};
