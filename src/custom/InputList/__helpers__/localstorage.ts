import { Item } from "../../../core";

export const todoListKey = "todolist";

export const saveItems = (listId: string) => (items: Item[]) => {
  localStorage.setItem(listId, JSON.stringify(items));
};

export const fetchItems = (listId: string) => () =>
  JSON.parse(localStorage.getItem(listId) || "[]") as Item[];
