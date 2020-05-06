import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { TodosState } from "./types";
import {
  addTodo,
  deleteTodo,
  expandTodo,
  updateTodoTitle,
  toggleTodo,
  moveTodo,
} from "./action-creators";
import { ListCard as List, BaseCardHeaderProps } from "../../core";
import Menu from "./Menu";

export const useStyles = makeStyles((theme: Theme) => ({
  card: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    boxShadow: "none",
  },
}));

export function TodoList({
  viewId,
  title,
  cardHeaderProps,
}: {
  viewId: string;
  title?: string;
  cardHeaderProps?: BaseCardHeaderProps;
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { parts, views, todos: allTodos } = useSelector(
    (state: { todos: TodosState }) => state.todos
  );

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
          add: (title: string) => dispatch(addTodo({ viewId, title })),
        }}
        listItems={todos.map((todo) => {
          const errors = todo.errors;
          const id = todo.id;
          const expandButtonClassName = parts[id]?.length
            ? "hasElements"
            : undefined;

          return {
            itemId: id,
            primary: todo.title,
            primaryError: Boolean(errors),
            primaryHelperText: errors && errors.join(", "),
            primaryEnter: (title: string) =>
              dispatch(updateTodoTitle({ viewId, id, title })),
            checked: todo.checked,
            checkboxProps: {
              onClick: () => dispatch(toggleTodo({ viewId, id })),
            },
            deleteButtonProps: {
              onClick: () => dispatch(deleteTodo({ viewId, id })),
            },
            expandButtonProps: {
              className: expandButtonClassName,
              onClick: () => dispatch(expandTodo({ viewId, id })),
            },
          };
        })}
        cardHeaderProps={
          cardHeaderProps || {
            action: <Menu viewId={viewId} />,
          }
        }
      />
    </DragDropContext>
  );
}
