import { SET_NCARDS, INCREMENT_NCARDS, DECREMENT_NCARDS } from "./consts";

export type SetNCardsAction = {
  type: typeof SET_NCARDS;
  payload: number;
};

export type IncrementNCardsAction = {
  type: typeof INCREMENT_NCARDS;
};

export type DecrementNCardsAction = {
  type: typeof DECREMENT_NCARDS;
};

export type NCardsAction =
  | SetNCardsAction
  | IncrementNCardsAction
  | DecrementNCardsAction;
