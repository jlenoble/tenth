import { ItemId, State } from "../../types";

export const getOrder = (id: ItemId) => (state: State): ItemId[] => {
  return state.orders.get(id) || [];
};
