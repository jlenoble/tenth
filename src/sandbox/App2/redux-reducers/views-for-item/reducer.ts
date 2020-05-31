import { Reducer } from "redux";
// import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { ViewForItem, ViewsForItemState as State } from "../../types";
import { ADD_VIEW_FOR_ITEM, REMOVE_VIEW_FOR_ITEM } from "./consts";
import { ViewsForItemAction } from "./actions";

const initialState: State = new Map();

export const addViewForItemReducer = (
  state: State,
  { id, viewId }: ViewForItem
): State => {
  if (state.get(id)?.has(viewId)) {
    return state;
  }

  const newState = new Map(state);
  const newViews = new Set(newState.get(id));
  newViews.add(viewId);
  newState.set(id, newViews);

  return newState;
};

export const removeViewForItemReducer = (
  state: State,
  { id, viewId }: ViewForItem
): State => {
  if (!state.get(id)?.has(viewId)) {
    return state;
  }

  const newState = new Map(state);
  const newViews = new Set(newState.get(id));
  newViews.delete(viewId);
  newState.set(id, newViews);

  return newState;
};

export const viewsForItemReducer: Reducer</* OptimisticState<*/ State /* >*/> =
  /* optimistic<
  State
>(*/
  ((state = initialState, action: ViewsForItemAction): State => {
    if (action) {
      switch (action.type) {
        case ADD_VIEW_FOR_ITEM: {
          return addViewForItemReducer(state, action.payload);
        }

        case REMOVE_VIEW_FOR_ITEM: {
          return removeViewForItemReducer(state, action.payload);
        }

        default:
          return state;
      }
    }

    return state;
  }) as Reducer<State>; /*
) as Reducer<OptimisticState<State>>*/
