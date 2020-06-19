import { ClientItem, ClientRelationship, ItemId, State } from "../../types";
import { getItemByTitle, getItem } from "../items";
import { getRelationshipsForLeftItemAndRelation } from "../relationships-for-item";

export const getOrderRelationship = (id: ItemId) => (
  state: State
): ClientRelationship | undefined => {
  const order = getItemByTitle(">")(state);

  if (order) {
    const [orderRelationDef] = getRelationshipsForLeftItemAndRelation({
      relatedToId: id,
      relationId: order.id,
    })(state);

    return orderRelationDef;
  }
};

export const getOrderRelation = (id: ItemId) => (
  state: State
): ClientItem | undefined => {
  const relationship = getOrderRelationship(id)(state);

  if (relationship) {
    return getItem(relationship.ids[2])(state);
  }
};

export const getLastOrderedItem = (id: ItemId) => (
  state: State
): ClientItem | undefined => {
  const order = getOrderRelation(id)(state);
  if (order) {
    const ids = state.orders.get(id)?.get(order.id)?.ids || [];
    return getItem(ids[ids.length - 1])(state);
  }
};
