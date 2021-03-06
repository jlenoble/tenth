import { Reducer } from "redux";
import { ViewsForSubItemState as State } from "../../types";
import {
  ADD_VIEW_FOR_SUBITEM,
  REMOVE_VIEW_FOR_SUBITEM,
  ADD_VIEW_FOR_SUBITEMS,
  REMOVE_VIEW_FOR_SUBITEMS,
  REMOVE_ALL_VIEWS_FOR_SUBITEM,
} from "./consts";
import { ViewsForSubItemAction } from "./actions";
import {
  addViewForItemReducer,
  removeViewForItemReducer,
} from "../views-for-item";

const initialState: State = new Map();

export const viewsForSubItemReducer: Reducer<State> = ((
  state = initialState,
  action: ViewsForSubItemAction
): State => {
  if (action) {
    switch (action.type) {
      case ADD_VIEW_FOR_SUBITEM: {
        return addViewForItemReducer(state, action.payload);
      }

      case REMOVE_VIEW_FOR_SUBITEM: {
        return removeViewForItemReducer(state, action.payload);
      }

      case ADD_VIEW_FOR_SUBITEMS: {
        const { ids, viewId } = action.payload;
        return ids
          .map((id) => ({ id, viewId }))
          .reduce(addViewForItemReducer, state);
      }

      case REMOVE_VIEW_FOR_SUBITEMS: {
        const { ids, viewId } = action.payload;
        return ids
          .map((id) => ({ id, viewId }))
          .reduce(removeViewForItemReducer, state);
      }

      case REMOVE_ALL_VIEWS_FOR_SUBITEM: {
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
