import { ListItemProps } from "../../../core";

export type Todo = { title: string; completed: boolean };
export type TodoView = Omit<ListItemProps, "itemId">;
