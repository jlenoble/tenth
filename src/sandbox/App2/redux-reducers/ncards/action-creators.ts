import { SET_NCARDS, INCREMENT_NCARDS, DECREMENT_NCARDS } from "./consts";
import {
  SetNCardsAction,
  IncrementNCardsAction,
  DecrementNCardsAction,
} from "./actions";

export const setNCards = (n: number): SetNCardsAction => ({
  type: SET_NCARDS,
  payload: n,
});

export const incrementNCards = (): IncrementNCardsAction => ({
  type: INCREMENT_NCARDS,
});

export const decrementNCards = (): DecrementNCardsAction => ({
  type: DECREMENT_NCARDS,
});
