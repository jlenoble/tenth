import { Reducer } from "redux";
// import { optimistic, OptimisticState } from "redux-optimistic-ui";
import { Ids, RelationshipsForItemState as State } from "../../types";
import {
  ADD_RELATIONSHIP_FOR_ITEM,
  REMOVE_RELATIONSHIP_FOR_ITEM,
  ADD_RELATIONSHIPS_FOR_ITEM,
  REMOVE_RELATIONSHIPS_FOR_ITEM,
} from "./consts";
import { RelationshipsForItemAction } from "./actions";

const initialState: State = new Map();

const addRelationship = (state: State, ids: Ids): State => {
  const relationship = ids.join(":");

  if (state.get(ids[0])?.has(relationship)) {
    return state;
  }

  const newState = new Map(state);

  ids.forEach((id) => {
    const newRelationships = new Set(newState.get(id));
    newRelationships.add(relationship);
    newState.set(id, newRelationships);
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
    const newRelationships = new Set(newState.get(id));
    newRelationships.delete(relationship);
    newState.set(id, newRelationships);
  });

  return newState;
};

export const relationshipsForItemReducer: Reducer</* OptimisticState<*/
State /*
>*/> =
  /* optimistic<State>(*/
  ((state = initialState, action: RelationshipsForItemAction): State => {
    if (action) {
      switch (action.type) {
        case ADD_RELATIONSHIP_FOR_ITEM: {
          return addRelationship(state, action.payload);
        }

        case REMOVE_RELATIONSHIP_FOR_ITEM: {
          return removeRelationship(state, action.payload);
        }

        case ADD_RELATIONSHIPS_FOR_ITEM: {
          return action.payload.reduce(addRelationship, state);
        }

        case REMOVE_RELATIONSHIPS_FOR_ITEM: {
          return action.payload.reduce(removeRelationship, state);
        }

        default:
          return state;
      }
    }

    return state;
  }) as Reducer<State>; /*
) as Reducer<OptimisticState<State>>*/
