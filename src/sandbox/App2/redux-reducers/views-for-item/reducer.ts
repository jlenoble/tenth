import { Reducer } from "redux";
import { ViewForItem, ViewsForItemState as State } from "../../types";
import {
  ADD_VIEW_FOR_ITEM,
  REMOVE_VIEW_FOR_ITEM,
  REMOVE_ALL_VIEWS_FOR_ITEM,
} from "./consts";
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

  if (newViews.size) {
    newState.set(id, newViews);
  } else {
    newState.delete(id);
  }

  return newState;
};

export const viewsForItemReducer: Reducer<State> = ((
  state = initialState,
  action: ViewsForItemAction
): State => {
  if (action) {
    switch (action.type) {
      case ADD_VIEW_FOR_ITEM: {
        return addViewForItemReducer(state, action.payload);
      }

      case REMOVE_VIEW_FOR_ITEM: {
        return removeViewForItemReducer(state, action.payload);
      }

      case REMOVE_ALL_VIEWS_FOR_ITEM: {
        if (state.has(action.payload)) {
          const newState = new Map(state);
          newState.delete(action.payload);
          return newState;
        }
        return state;
      }

      default:
        return state;
    }
  }

  return state;
}) as Reducer<State>;
