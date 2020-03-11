import { Item } from "../../../../core";

export const saveItems = (localStorageId: string) => (items: Item[]) => {
  localStorage.setItem(localStorageId, JSON.stringify(items));
};

export const fetchItems = (localStorageId: string) => () =>
  JSON.parse(localStorage.getItem(localStorageId) || "[]") as Item[];
