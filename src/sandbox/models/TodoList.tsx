import React, { ChangeEvent, KeyboardEvent } from "react";
import { combineReducers } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { todos, addTodo, deleteTodo, updateTodo, toggleTodo } from "./todo";
import { visibilityFilter } from "./visibility";
import {
  currentEdit,
  startCurrentEdit,
  updateCurrentEdit,
  stopCurrentEdit
} from "./current-edit";
import { AddItem, List } from "../../core";

export const combinedReducer = combineReducers({
  todos,
  visibilityFilter,
  currentEdit
});

export function TodoList() {
  let todos = useSelector(
    (state: ReturnType<typeof combinedReducer>) => state.todos
  );
  const { elementId, value: currentEditValue } = useSelector(
    (state: ReturnType<typeof combinedReducer>) => state.currentEdit
  );
  const dispatch = useDispatch();

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  todos = [...pendingTodos, ...completedTodos];

  return (
    <>
      <AddItem add={(value: string) => dispatch(addTodo(value))} />
      <List
        listItems={todos.map((todo, i) => ({
          itemId: todo.id,
          primary: todo.title,
          primaryEdited: elementId === String(i),
          primaryTextFieldProps: {
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              dispatch(
                updateCurrentEdit({
                  elementId: String(i),
                  value: event.target.value
                })
              ),
            onBlur: () => dispatch(stopCurrentEdit()),
            onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                dispatch(stopCurrentEdit());
                dispatch(updateTodo({ ...todo, title: currentEditValue }));
                return true;
              }

              return false;
            }
          },
          checked: todo.completed,
          checkboxProps: { onClick: () => dispatch(toggleTodo(todo.id)) },
          listItemTextProps: {
            onClick: () =>
              dispatch(
                startCurrentEdit({ elementId: String(i), value: todo.title })
              )
          },
          deleteButtonProps: { onClick: () => dispatch(deleteTodo(todo.id)) }
        }))}
      />
    </>
  );
}
