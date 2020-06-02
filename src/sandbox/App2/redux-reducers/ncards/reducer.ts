import { Reducer } from "redux";
import { NCardsState as State } from "../../types";
import { SET_NCARDS, INCREMENT_NCARDS, DECREMENT_NCARDS } from "./consts";
import { NCardsAction } from "./actions";

let initialState: State = parseInt(
  JSON.parse(
    (typeof localStorage !== "undefined" && localStorage.getItem("nCards")) ||
      "1"
  ),
  10
);

if (typeof initialState !== "number") {
  initialState = 1;
}

export const nCardsReducer: Reducer<State> = ((
  state = initialState,
  action: NCardsAction
): State => {
  if (action) {
    switch (action.type) {
      case SET_NCARDS: {
        return action.payload;
      }

      case INCREMENT_NCARDS: {
        return state + 1;
      }

      case DECREMENT_NCARDS: {
        return state - 1;
      }

      default: {
        return state;
      }
    }
  }

  return state;
}) as Reducer<State>;
