import { ItemId, RelationshipId, ClientRelationship, State } from "../../types";

export const getRelationshipsForItem = (id: ItemId) => (
  state: State
): ClientRelationship[] => {
  const relationshipMap = state.relationshipsForItem;
  const relationshipsForItem = relationshipMap.get(id);

  if (!relationshipsForItem) {
    return [];
  }

  return Array.from(relationshipsForItem.values());
};

export const getRelationshipsForItemAndRelation = ({
  id,
  relationId,
}: {
  id: ItemId;
  relationId: RelationshipId;
}) => (state: State): ClientRelationship[] => {
  const relationshipMap = state.relationshipsForItem;
  const relationshipsForItem = relationshipMap.get(id);
  const relationshipsForItem2 = relationshipMap.get(relationId);

  if (!relationshipsForItem || !relationshipsForItem2) {
    return [];
  }

  return Array.from(relationshipsForItem.values()).filter(({ id }) =>
    relationshipsForItem2.has(id)
  );
};

const makeGetRelationshipsForItem = (pos: 0 | 1 | 2) => (id: ItemId) => {
  const reducer = getRelationshipsForItem(id);

  return (state: State): ClientRelationship[] =>
    reducer(state).filter(({ ids }) => ids[pos] === id);
};

export const getRelationshipsForLeftItem = makeGetRelationshipsForItem(0);
export const getRelationshipsForRelation = makeGetRelationshipsForItem(1);
export const getRelationshipsForRightItem = makeGetRelationshipsForItem(2);

export const getRelationshipsForLeftItemAndRelation = ({
  relatedToId: id,
  relationId,
}: {
  relatedToId: ItemId;
  relationId: RelationshipId;
}) => (state: State): ClientRelationship[] => {
  const reducer = getRelationshipsForItemAndRelation({ id, relationId });

  return reducer(state).filter(({ ids }) => ids[0] === id);
};

export const getRelationshipsForRightItemAndRelation = ({
  relatedId: id,
  relationId,
}: {
  relatedId: ItemId;
  relationId: RelationshipId;
}) => (state: State): ClientRelationship[] => {
  const reducer = getRelationshipsForItemAndRelation({ id, relationId });

  return reducer(state).filter(({ ids }) => ids[2] === id);
};
