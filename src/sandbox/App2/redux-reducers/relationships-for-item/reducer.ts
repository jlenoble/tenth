import { Reducer } from "redux";
import {
  ClientRelationship,
  RelationshipsForItemState as State,
} from "../../types";
import {
  ADD_RELATIONSHIP_FOR_ITEM,
  REMOVE_RELATIONSHIP_FOR_ITEM,
  ADD_RELATIONSHIPS_FOR_ITEM,
  REMOVE_RELATIONSHIPS_FOR_ITEM,
  REMOVE_ALL_RELATIONSHIPS_FOR_ITEM,
} from "./consts";
import { RelationshipsForItemAction } from "./actions";

const initialState: State = new Map();

export const addRelationshipForItemReducer = (
  state: State,
  relationship: ClientRelationship
): State => {
  const {
    id,
    ids: [id1, id2, id3],
  } = relationship;

  if (state.get(id1)?.has(id)) {
    return state;
  }

  const newState = new Map(state);

  const newViews1 = new Map(newState.get(id1) || []);
  const newViews2 = new Map(newState.get(id2) || []);
  const newViews3 = new Map(newState.get(id3) || []);

  newViews1.set(id, relationship);
  newViews2.set(id, relationship);
  newViews3.set(id, relationship);

  newState.set(id1, newViews1);
  newState.set(id2, newViews2);
  newState.set(id3, newViews3);

  return newState;
};

export const removeRelationshipForItemReducer = (
  state: State,
  relationship: ClientRelationship
): State => {
  const {
    id,
    ids: [id1, id2, id3],
  } = relationship;

  if (!state.get(id1)?.has(id)) {
    return state;
  }

  const newState = new Map(state);

  const newViews1 = new Map(newState.get(id1) || []);
  const newViews2 = new Map(newState.get(id2) || []);
  const newViews3 = new Map(newState.get(id3) || []);

  newViews1.delete(id);
  newViews2.delete(id);
  newViews3.delete(id);

  if (newViews1.size) {
    newState.set(id1, newViews1);
  } else {
    newState.delete(id1);
  }

  if (newViews2.size) {
    newState.set(id2, newViews2);
  } else {
    newState.delete(id2);
  }

  if (newViews3.size) {
    newState.set(id3, newViews3);
  } else {
    newState.delete(id3);
  }

  return newState;
};

export const relationshipsForItemReducer: Reducer<State> = ((
  state = initialState,
  action: RelationshipsForItemAction
): State => {
  if (action) {
    switch (action.type) {
      case ADD_RELATIONSHIP_FOR_ITEM: {
        return addRelationshipForItemReducer(state, action.payload);
      }

      case REMOVE_RELATIONSHIP_FOR_ITEM: {
        return removeRelationshipForItemReducer(state, action.payload);
      }

      case ADD_RELATIONSHIPS_FOR_ITEM: {
        return action.payload.reduce(addRelationshipForItemReducer, state);
      }

      case REMOVE_RELATIONSHIPS_FOR_ITEM: {
        return action.payload.reduce(removeRelationshipForItemReducer, state);
      }

      case REMOVE_ALL_RELATIONSHIPS_FOR_ITEM: {
        const relationshipMap = state.get(action.payload);

        if (relationshipMap) {
          const relationships = Array.from(relationshipMap.values());
          return relationships.reduce(removeRelationshipForItemReducer, state);
        }
        return state;
      }

      default:
        return state;
    }
  }

  return state;
}) as Reducer<State>;
