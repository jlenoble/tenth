import { Reducer } from "redux";
import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { CurrentPathState as State } from "../../types";
import {
  DEEPEN_CURRENT_PATH,
  MOVE_BACK_CURRENT_PATH,
  SET_CURRENT_PATH,
  SET_CURRENT_PATH_TO_SIBLING_PATH,
} from "./consts";
import { CurrentPathAction } from "./actions";

const initialState: State = JSON.parse(
  (typeof localStorage !== "undefined" &&
    localStorage.getItem("currentPath")) ||
    "[1]"
);

export const currentPathReducer: Reducer<OptimisticState<State>> = optimistic<
  State
>(
  ((state = initialState, action: CurrentPathAction): State => {
    if (action) {
      switch (action.type) {
        case DEEPEN_CURRENT_PATH: {
          return [...state, action.payload];
        }

        case MOVE_BACK_CURRENT_PATH: {
          return state.slice(0, state.length - 1);
        }

        case SET_CURRENT_PATH: {
          return action.payload;
        }

        case SET_CURRENT_PATH_TO_SIBLING_PATH: {
          const newState = state.concat();
          newState[state.length - 1] = action.payload;
          return newState;
        }

        default: {
          return state;
        }
      }
    }

    return state;
  }) as Reducer<State>
) as Reducer<OptimisticState<State>>;
