import { Item } from "../../../core";

export const save = (localStorageId: string) => (items: Item[]) => {
  localStorage.setItem(localStorageId, JSON.stringify(items));
};

export const fetch = (localStorageId: string) => () =>
  JSON.parse(localStorage.getItem(localStorageId) || "[]") as Item[];
