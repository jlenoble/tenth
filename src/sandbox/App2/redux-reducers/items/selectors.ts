import { ClientItem, ItemId, State } from "../../types";

export const getItems = (state: State): ClientItem[] => {
  return Array.from(state.items.values());
};

export const getItem = (id: ItemId) => (
  state: State
): ClientItem | undefined => {
  return state.items.get(id);
};

export const getItemByTitle = (title: string) => (
  state: State
): ClientItem | undefined => {
  for (const item of state.items.values()) {
    if (item.title === title) {
      return item;
    }
  }
};

export const getItemsById = (ids: ItemId[]) => (state: State): ClientItem[] => {
  const items = state.items;
  return ids
    .map((id) => items.get(id))
    .filter((item) => item !== undefined) as ClientItem[];
};

export const getItemsByTitle = (titles: string[]) => (
  state: State
): ClientItem[] => {
  const items: ClientItem[] = [];
  const _titles = new Set(titles);

  for (const item of state.items.values()) {
    if (_titles.has(item.title)) {
      items.push(item);
    }
  }
  return items;
};
