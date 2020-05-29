import { Reducer } from "redux";
import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { ItemsState as State } from "../../types";
import { SET_ITEMS } from "./consts";
import { ItemsAction } from "./actions";

const initialState: State = new Map();

export const itemsReducer: Reducer<OptimisticState<State>> = optimistic<State>(
  ((state = initialState, action: ItemsAction): State => {
    if (action) {
      switch (action.type) {
        case SET_ITEMS: {
          return new Map(action.payload.map((item) => [item.id, item]));
        }

        default:
          return state;
      }
    }

    return state;
  }) as Reducer<State>
) as Reducer<OptimisticState<State>>;
