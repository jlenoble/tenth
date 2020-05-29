import { Reducer } from "redux";
import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { ViewsForItemState as State } from "../../types";
import { ADD_VIEW_FOR_SUBITEM, REMOVE_VIEW_FOR_SUBITEM } from "./consts";
import { ViewsForSubItemAction } from "./actions";

const initialState: State = new Map();

export const viewsForSubItemReducer: Reducer<OptimisticState<
  State
>> = optimistic<State>(
  ((state = initialState, action: ViewsForSubItemAction): State => {
    if (action) {
      switch (action.type) {
        case ADD_VIEW_FOR_SUBITEM: {
          const {
            payload: { id, viewId },
          } = action;

          if (state.get(id)?.has(viewId)) {
            return state;
          }

          const newState = new Map(state);
          const newViews = new Set(newState.get(id));
          newViews.add(viewId);
          newState.set(id, newViews);

          return newState;
        }

        case REMOVE_VIEW_FOR_SUBITEM: {
          const {
            payload: { id, viewId },
          } = action;

          if (!state.get(id)?.has(viewId)) {
            return state;
          }

          const newState = new Map(state);
          const newViews = new Set(newState.get(id));
          newViews.delete(viewId);
          newState.set(id, newViews);

          return newState;
        }

        default:
          return state;
      }
    }

    return state;
  }) as Reducer<State>
) as Reducer<OptimisticState<State>>;
