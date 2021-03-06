import { Reducer } from "redux";
import { CurrentPathState as State } from "../../types";
import {
  DEEPEN_CURRENT_PATH,
  MOVE_BACK_CURRENT_PATH,
  SET_CURRENT_PATH,
  SET_CURRENT_PATH_TO_SIBLING_PATH,
} from "./consts";
import { CurrentPathAction } from "./actions";

let initialState: State = JSON.parse(
  (typeof localStorage !== "undefined" &&
    localStorage.getItem("currentPath")) ||
    "[1]"
);

if (
  !Array.isArray(initialState) ||
  !initialState.length ||
  !initialState.every((id) => typeof id === "number")
) {
  initialState = [1];
}

export const currentPathReducer: Reducer<State> = ((
  state = initialState,
  action: CurrentPathAction
): State => {
  if (action) {
    switch (action.type) {
      case DEEPEN_CURRENT_PATH: {
        return [...state, action.payload];
      }

      case MOVE_BACK_CURRENT_PATH: {
        if (state.length > 1) {
          return state.slice(0, state.length - 1);
        }
        break;
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
}) as Reducer<State>;
