import { Item } from "..";

export const todoListKey = "todolist";

export const saveItems = (listId: string) => (items: Item[]) => {
  localStorage.setItem(listId, JSON.stringify(items));
};
