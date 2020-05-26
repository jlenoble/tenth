import { Reducer } from "redux";
import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { Ids, RelationshipState as State } from "../../types";
import {
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
} from "./consts";
import { RelationshipAction } from "./actions";

const initialState: State = new Map();

const addRelationship = (state: State, ids: Ids): State => {
  const relationship = ids.join(":");

  if (state.get(ids[0])?.has(relationship)) {
    return state;
  }

  const newState = new Map(state);

  ids.forEach((id) => {
    if (newState.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newState.get(id)!.add(relationship);
    } else {
      newState.set(id, new Set([relationship]));
    }
  });

  return newState;
};

const removeRelationship = (state: State, ids: Ids): State => {
  const relationship = ids.join(":");

  if (!state.get(ids[0])?.has(relationship)) {
    return state;
  }

  const newState = new Map(state);

  ids.forEach((id) => {
    if (newState.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const relationships = newState.get(id)!;
      relationships.delete(relationship);
      if (relationships.size === 0) {
        newState.delete(id);
      }
    }
  });

  return newState;
};

export const relationshipReducer: Reducer<OptimisticState<State>> = optimistic<
  State
>(
  ((state = initialState, action: RelationshipAction): State => {
    if (action) {
      switch (action.type) {
        case ADD_RELATIONSHIP: {
          return addRelationship(state, action.payload);
        }

        case REMOVE_RELATIONSHIP: {
          return removeRelationship(state, action.payload);
        }

        case ADD_RELATIONSHIPS: {
          return action.payload.reduce(addRelationship, state);
        }

        case REMOVE_RELATIONSHIPS: {
          return action.payload.reduce(removeRelationship, state);
        }

        default:
          return state;
      }
    }

    return state;
  }) as Reducer<State>
) as Reducer<OptimisticState<State>>;
