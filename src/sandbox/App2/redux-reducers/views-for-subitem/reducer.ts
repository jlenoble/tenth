import { Reducer } from "redux";
import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { ViewsForSubItemState as State } from "../../types";
import {
  ADD_VIEW_FOR_SUBITEM,
  REMOVE_VIEW_FOR_SUBITEM,
  ADD_VIEW_FOR_SUBITEMS,
  REMOVE_VIEW_FOR_SUBITEMS,
} from "./consts";
import { ViewsForSubItemAction } from "./actions";
import {
  addViewForItemReducer,
  removeViewForItemReducer,
} from "../views-for-item";

const initialState: State = new Map();

export const viewsForSubItemReducer: Reducer<OptimisticState<
  State
>> = optimistic<State>(
  ((state = initialState, action: ViewsForSubItemAction): State => {
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

        default:
          return state;
      }
    }

    return state;
  }) as Reducer<State>
) as Reducer<OptimisticState<State>>;
