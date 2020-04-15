import React from "react";
import { combineReducers } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { todos, addTodo, deleteTodo, toggleTodo } from "./todo";
import { visibilityFilter } from "./visibility";
import { AddItem, List } from "../../core";

export const combinedReducer = combineReducers({ todos, visibilityFilter });

export function TodoList() {
  const todos = useSelector(
    (state: ReturnType<typeof combinedReducer>) => state.todos
  );
  const dispatch = useDispatch();

  return (
    <>
      <AddItem add={(value: string) => dispatch(addTodo(value))} />
      <List
        listItems={todos.map((todo) => ({
          itemId: todo.id,
          primary: todo.title,
          checked: todo.completed,
          checkboxProps: { onClick: () => dispatch(toggleTodo(todo.id)) },
          deleteButtonProps: { onClick: () => dispatch(deleteTodo(todo.id)) }
        }))}
      />
    </>
  );
}
