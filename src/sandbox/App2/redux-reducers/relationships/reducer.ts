import { Reducer } from "redux";
import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { RelationshipsState as State } from "../../types";
import { SET_RELATIONSHIPS } from "./consts";
import { RelationshipsAction } from "./actions";

const initialState: State = new Map();

export const relationshipsReducer: Reducer<OptimisticState<State>> = optimistic<
  State
>(
  ((state = initialState, action: RelationshipsAction): State => {
    if (action) {
      switch (action.type) {
        case SET_RELATIONSHIPS: {
          return new Map(
            action.payload.map((relationship) => [
              relationship.id,
              relationship,
            ])
          );
        }

        default:
          return state;
      }
    }

    return state;
  }) as Reducer<State>
) as Reducer<OptimisticState<State>>;
