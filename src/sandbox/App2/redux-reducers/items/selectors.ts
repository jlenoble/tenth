import { ClientItem, ItemId, State } from "../../types";

export const getItems = (state: State): ClientItem[] => {
  return Array.from(state.items.values());
};

export const getItem = (id: ItemId) => (
  state: State
): ClientItem | undefined => {
  return state.items.get(id);
};

export const getItemsById = (ids: ItemId[]) => (state: State): ClientItem[] => {
  const items = state.items;
  return ids
    .map((id) => items.get(id))
    .filter((item) => item !== undefined) as ClientItem[];
};
