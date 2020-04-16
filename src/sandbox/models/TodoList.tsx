import React, { ChangeEvent, KeyboardEvent } from "react";
import { combineReducers } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { todos, addTodo, deleteTodo, updateTodo, toggleTodo } from "./todo";
import { visibilityFilter } from "./visibility";
import {
  currentInput,
  startCurrentInput,
  updateCurrentInput,
  stopCurrentInput
} from "./current-input";
import { List } from "../../core";

export const combinedReducer = combineReducers({
  todos,
  visibilityFilter,
  currentInput
});

export function TodoList() {
  let todos = useSelector(
    (state: ReturnType<typeof combinedReducer>) => state.todos
  );
  const { elementId, value: currentInput } = useSelector(
    (state: ReturnType<typeof combinedReducer>) => state.currentInput
  );
  const dispatch = useDispatch();

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  todos = [...pendingTodos, ...completedTodos];

  return (
    <>
      <List
        addItemProps={{
          value: currentInput,
          onChange: (event: ChangeEvent<HTMLInputElement>) =>
            dispatch(updateCurrentInput(event.target.value)),
          onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              dispatch(updateCurrentInput(""));
              dispatch(addTodo(currentInput));
              return true;
            }

            return false;
          },
          buttonProps: {
            onClick: () => {
              dispatch(updateCurrentInput(""));
              dispatch(addTodo(currentInput));
            }
          }
        }}
        listItems={todos.map((todo, i) => ({
          itemId: todo.id,
          primary: todo.title,
          primaryEdited: elementId === String(i),
          primaryTextFieldProps: {
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              dispatch(
                updateCurrentInput({
                  elementId: String(i),
                  value: event.target.value
                })
              ),
            onBlur: () => dispatch(stopCurrentInput()),
            onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                dispatch(stopCurrentInput());
                dispatch(updateTodo({ ...todo, title: currentInput }));
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
                startCurrentInput({ elementId: String(i), value: todo.title })
              )
          },
          deleteButtonProps: { onClick: () => dispatch(deleteTodo(todo.id)) }
        }))}
      />
    </>
  );
}
