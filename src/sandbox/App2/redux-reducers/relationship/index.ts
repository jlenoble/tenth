import { ItemId } from "../../types";
import { ADD, REMOVE } from "./consts";
import { Action } from "./actions";

const initialState: Map<ItemId, Set<string>> = new Map();

export const relationshipReducer = (
  state = initialState,
  action: Action
): typeof initialState => {
  if (action && Array.isArray(action.ids)) {
    const ids = action.ids;
    const [relatedToId, relationId, relatedId] = ids;

    switch (action.type) {
      case ADD: {
        if (
          state.has(relatedToId) &&
          state.has(relationId) &&
          state.has(relatedId)
        ) {
          return state;
        }

        const newState = new Map(state);
        const relationship = ids.join(":");

        ids.forEach((id) => {
          if (newState.has(id)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            newState.get(id)!.add(relationship);
          } else {
            newState.set(id, new Set([relationship]));
          }
        });

        return newState;
      }

      case REMOVE: {
        if (
          !state.has(relatedToId) &&
          !state.has(relationId) &&
          !state.has(relatedId)
        ) {
          return state;
        }

        const newState = new Map(state);
        const relationship = ids.join(":");

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
      }

      default:
        return state;
    }
  }

  return state;
};
