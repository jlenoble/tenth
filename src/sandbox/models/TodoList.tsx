import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { combineReducers } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  todos,
  addTodo,
  deleteTodo,
  updateTodoTitle,
  toggleTodo,
  moveTodo
} from "./todo";
import { visibilityFilter } from "./visibility";
import { ListCard as List } from "../../core";
import Menu from "./Menu";

export const combinedReducer = combineReducers({
  todos,
  visibilityFilter
});

export const defaultTitle = "TODOS";

export const getTodos = (state: ReturnType<typeof combinedReducer>) =>
  state.todos;

export const useStyles = makeStyles((theme: Theme) => ({
  card: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    boxShadow: "none"
  }
}));

export function TodoList() {
  const classes = useStyles();

  const { todos } = useSelector(getTodos);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(defaultTitle);

  return (
    <DragDropContext
      onDragEnd={(dropResult: DropResult) => dispatch(moveTodo(dropResult))}
    >
      <List
        droppableId="drop-area"
        classes={{ root: classes.card }}
        title={title}
        titleEnter={(title: string) => {
          setTitle(title);
        }}
        addItemProps={{ add: (value: string) => dispatch(addTodo(value)) }}
        listItems={todos.map((todo) => {
          const errors = todo.errors;

          return {
            itemId: todo.id,
            primary: todo.title,
            primaryError: Boolean(errors),
            primaryHelperText: errors && errors.join(", "),
            primaryEnter: (value: string) =>
              dispatch(updateTodoTitle(todo.id, value)),
            checked: todo.checked,
            checkboxProps: { onClick: () => dispatch(toggleTodo(todo.id)) },
            deleteButtonProps: { onClick: () => dispatch(deleteTodo(todo.id)) }
          };
        })}
        cardHeaderProps={{
          action: <Menu />
        }}
      />
    </DragDropContext>
  );
}
