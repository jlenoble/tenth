import { Reducer } from "redux";
import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { CurrentPathState as State } from "../../types";
import { SET_CURRENT_PATH } from "./consts";
import { SetCurrentPathAction } from "./actions";

const initialState: State = [1];

export const currentPathReducer: Reducer<OptimisticState<State>> = optimistic<
  State
>(
  ((state = initialState, action: SetCurrentPathAction): State => {
    if (action) {
      switch (action.type) {
        case SET_CURRENT_PATH: {
          return action.payload;
        }

        default: {
          return state;
        }
      }
    }

    return state;
  }) as Reducer<State>
) as Reducer<OptimisticState<State>>;
