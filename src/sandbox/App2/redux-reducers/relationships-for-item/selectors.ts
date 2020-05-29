import { ensureState } from "redux-optimistic-ui";
import { ItemId, Ids, State } from "../../types";

const makeGetRelationshipsForItem = (pos: 0 | 1 | 2) => (id: ItemId) => {
  return (state: State): Ids[] => {
    const relationshipMap = ensureState(state.relationshipsForItem);
    const relationshipsForItem = relationshipMap.get(id);

    if (!relationshipsForItem) {
      return [];
    }

    return Array.from(relationshipsForItem)
      .map(
        (relationship): Ids => {
          const strs = relationship.split(":");

          return [
            parseInt(strs[0], 10),
            parseInt(strs[1], 10),
            parseInt(strs[2], 10),
          ];
        }
      )
      .filter((relationship) => relationship[pos] === id);
  };
};

export const getRelationshipsForLeftItem = makeGetRelationshipsForItem(0);
export const getRelationshipsForRelation = makeGetRelationshipsForItem(1);
export const getRelationshipsForRightItem = makeGetRelationshipsForItem(2);
