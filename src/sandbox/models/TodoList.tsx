import React, { useState } from "react";
import { combineReducers } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { todos, addTodo, deleteTodo, updateTodo, toggleTodo } from "./todo";
import { visibilityFilter } from "./visibility";
import { ListCard as List } from "../../core";

export const combinedReducer = combineReducers({
  todos,
  visibilityFilter
});

export const getTodos = (state: ReturnType<typeof combinedReducer>) =>
  state.todos;

export function TodoList() {
  let todos = useSelector(getTodos);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("TODOS");

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  todos = [...pendingTodos, ...completedTodos];

  return (
    <List
      title={title}
      titleEnter={(title: string) => {
        setTitle(title);
      }}
      addItemProps={{ add: (value: string) => dispatch(addTodo(value)) }}
      listItems={todos.map((todo) => ({
        itemId: todo.id,
        primary: todo.title,
        primaryEnter: (value: string) =>
          dispatch(updateTodo({ ...todo, title: value })),
        checked: todo.completed,
        checkboxProps: { onClick: () => dispatch(toggleTodo(todo.id)) },
        deleteButtonProps: { onClick: () => dispatch(deleteTodo(todo.id)) }
      }))}
    />
  );
}
