import { DropResult } from "react-beautiful-dnd";
import { Todos, TodoState, TodoStates } from "../types";
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
  EXPAND_TODO
} from "../constants";
import { TodoActionType } from "../todo";

export const resetTodos = (meta: {
  partId: string;
  todos: Todos;
}): TodoActionType => {
  return {
    type: RESET_TODOS,
    meta
  };
};
export const setTodos = (meta: {
  partId: string;
  todos: TodoStates;
}): TodoActionType => {
  return {
    type: SET_TODOS,
    meta
  };
};
export const setTodosNoSave = (meta: {
  partId: string;
  todos: TodoStates;
}): TodoActionType => {
  return {
    type: SET_TODOS_NOSAVE,
    meta
  };
};

export const addTodo = (meta: {
  viewId: string;
  title: string;
}): TodoActionType => {
  return {
    type: ADD_TODO,
    meta
  };
};
export const doAddTodo = (meta: {
  viewId: string;
  todo: TodoState;
}): TodoActionType => {
  return {
    type: DO_ADD_TODO,
    meta
  };
};

export const updateTodoTitle = (meta: {
  viewId: string;
  id: string;
  title: string;
}): TodoActionType => {
  return {
    type: UPDATE_TODO_TITLE,
    meta
  };
};
export const doUpdateTodoTitle = (meta: {
  viewId: string;
  todo: Pick<TodoState, "id" | "title" | "validated" | "errors">;
}): TodoActionType => {
  return {
    type: DO_UPDATE_TODO_TITLE,
    meta
  };
};

export const deleteTodo = (meta: {
  viewId: string;
  id: string;
}): TodoActionType => {
  return {
    type: DELETE_TODO,
    meta
  };
};
export const toggleTodo = (meta: {
  viewId: string;
  id: string;
}): TodoActionType => {
  return {
    type: TOGGLE_TODO,
    meta
  };
};
export const moveTodo = (meta: {
  viewId: string;
  dropResult: DropResult;
}): TodoActionType => {
  return {
    type: MOVE_TODO,
    meta
  };
};

export const expandTodo = (meta: { id: string }): TodoActionType => {
  return {
    type: EXPAND_TODO,
    meta
  };
};
