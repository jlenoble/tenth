import { Reducer } from "redux";
import { RelationshipsState as State } from "../../types";
import {
  SET_RELATIONSHIPS,
  ADD_RELATIONSHIP,
  REMOVE_RELATIONSHIP,
  ADD_RELATIONSHIPS,
  REMOVE_RELATIONSHIPS,
} from "./consts";
import { RelationshipsAction } from "./actions";

const initialState: State = new Map();

export const relationshipsReducer: Reducer<State> = ((
  state = initialState,
  action: RelationshipsAction
): State => {
  if (action) {
    switch (action.type) {
      case SET_RELATIONSHIPS: {
        return new Map(
          action.payload.map((relationship) => [relationship.id, relationship])
        );
      }

      case ADD_RELATIONSHIP: {
        if (!state.has(action.payload.id)) {
          const newState = new Map(state);
          newState.set(action.payload.id, action.payload);
          return newState;
        }
        break;
      }

      case REMOVE_RELATIONSHIP: {
        if (state.has(action.payload)) {
          const newState = new Map(state);
          newState.delete(action.payload);
          return newState;
        }
        break;
      }

      case ADD_RELATIONSHIPS: {
        const relationships = action.payload.filter(({ id }) => !state.has(id));

        if (relationships.length) {
          const newState = new Map(state);
          relationships.forEach((relationship) =>
            newState.set(relationship.id, relationship)
          );
          return newState;
        }

        break;
      }

      case REMOVE_RELATIONSHIPS: {
        const relationships = action.payload.filter((id) => state.has(id));

        if (relationships.length) {
          const newState = new Map(state);
          relationships.forEach((id) => newState.delete(id));
          return newState;
        }

        break;
      }

      default:
        return state;
    }
  }

  return state;
}) as Reducer<State>;
