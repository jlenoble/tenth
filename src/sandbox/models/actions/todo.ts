import { DropResult } from "react-beautiful-dnd";
import {
  RESET_TODOS,
  SET_TODOS,
  SET_TODOS_NOSAVE,
  ADD_TODO,
  UPDATE_TODO_TITLE,
  DO_ADD_TODO,
  DO_UPDATE_TODO_TITLE,
  DELETE_TODO,
  TOGGLE_TODO,
  MOVE_TODO,
  EXPAND_TODO,
} from "../constants";
import { Todos, TodoState, TodoStates } from "../types";

export type TodoActions =
  | ResetTodosAction
  | SetTodosAction
  | SetTodosNoSaveAction
  | AddTodoAction
  | DoAddTodoAction
  | UpdateTodoTitleAction
  | DoUpdateTodoTitleAction
  | DeleteTodoAction
  | ToggleTodoAction
  | MoveTodoAction
  | ExpandTodoAction;

export interface ResetTodosAction {
  type: typeof RESET_TODOS;
  meta: { partId: string; todos: Todos };
}

export interface SetTodosAction {
  type: typeof SET_TODOS;
  meta: { partId: string; todos: TodoStates };
}

export interface SetTodosNoSaveAction {
  type: typeof SET_TODOS_NOSAVE;
  meta: { partId: string; todos: TodoStates };
}

export interface AddTodoAction {
  type: typeof ADD_TODO;
  meta: { viewId: string; title: string };
}

export interface DoAddTodoAction {
  type: typeof DO_ADD_TODO;
  meta: { viewId: string; todo: TodoState };
}

export interface UpdateTodoTitleAction {
  type: typeof UPDATE_TODO_TITLE;
  meta: { viewId: string; id: string; title: string };
}

export interface DoUpdateTodoTitleAction {
  type: typeof DO_UPDATE_TODO_TITLE;
  meta: {
    viewId: string;
    todo: Pick<TodoState, "id" | "title" | "validated" | "errors">;
  };
}

export interface DeleteTodoAction {
  type: typeof DELETE_TODO;
  meta: { viewId: string; id: string };
}

export interface ToggleTodoAction {
  type: typeof TOGGLE_TODO;
  meta: { viewId: string; id: string };
}

export interface MoveTodoAction {
  type: typeof MOVE_TODO;
  meta: { viewId: string; dropResult: DropResult };
}

export interface ExpandTodoAction {
  type: typeof EXPAND_TODO;
  meta: { viewId: string; id: string };
}
