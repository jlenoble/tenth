import { Item } from "..";

export const todoListKey = "todolist";

export const saveItems = (listId: string) => (items: Item[]) => {
  localStorage.setItem(listId, JSON.stringify(items));
};

export const getItemsFromLocalStorage = (listId: string) => () =>
  JSON.parse(localStorage.getItem(listId) || "[]") as Item[];

export const setItemsInLocalStorage = (listId: string) => (items: Item[]) =>
  localStorage.setItem(listId, JSON.stringify(items));
