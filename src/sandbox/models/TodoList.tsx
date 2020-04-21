import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { combineReducers } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  todos,
  addTodo,
  deleteTodo,
  expandTodo,
  updateTodoTitle,
  toggleTodo,
  moveTodo,
  getTodos
} from "./todo";
import { ui } from "./ui";
import { ListCard as List } from "../../core";
import Menu from "./Menu";

export const combinedReducer = combineReducers({
  todos,
  ui
});

export const useStyles = makeStyles((theme: Theme) => ({
  card: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    boxShadow: "none"
  }
}));

export function TodoList({
  viewId,
  title
}: {
  viewId: string;
  title?: string;
}) {
  const classes = useStyles();
  const { views, todos: allTodos } = useSelector(getTodos);
  const dispatch = useDispatch();
  const { todos, partId } = views[viewId];

  if (!title) {
    title = allTodos[partId].title;
  }

  return (
    <DragDropContext
      onDragEnd={(dropResult: DropResult) =>
        dispatch(moveTodo({ viewId, dropResult }))
      }
    >
      <List
        droppableId="drop-area"
        classes={{ root: classes.card }}
        title={title}
        addItemProps={{
          add: (title: string) => dispatch(addTodo({ viewId, title }))
        }}
        listItems={todos.map((todo) => {
          const errors = todo.errors;

          return {
            itemId: todo.id,
            primary: todo.title,
            primaryError: Boolean(errors),
            primaryHelperText: errors && errors.join(", "),
            primaryEnter: (title: string) =>
              dispatch(updateTodoTitle({ viewId, id: todo.id, title })),
            checked: todo.checked,
            checkboxProps: {
              onClick: () => dispatch(toggleTodo({ viewId, id: todo.id }))
            },
            deleteButtonProps: {
              onClick: () => dispatch(deleteTodo({ viewId, id: todo.id }))
            },
            expandButtonProps: {
              onClick: () => dispatch(expandTodo({ id: todo.id }))
            }
          };
        })}
        cardHeaderProps={{
          action: <Menu viewId={viewId} />
        }}
      />
    </DragDropContext>
  );
}
