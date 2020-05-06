import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
} from "@material-ui/core";
import { TodoState, TodoStates, TodosState } from "./types";
import { toggleTodo } from "./action-creators";
import { useStyles } from "./TodoList";
import { rootId } from "./todo";

export function CurrentTodo({ viewId }: { viewId: string }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { views, parts } = useSelector(
    (state: { todos: TodosState }) => state.todos
  );

  const noTodos = !parts[rootId]?.length;

  let partId = views[viewId].partId;
  let todos: TodoStates;
  let todo: TodoState | undefined;

  do {
    todos = parts[partId];

    if (!todos) {
      break;
    }

    const newTodo = todos.find((todo) => !todo.checked);

    if (!newTodo) {
      break;
    }

    todo = newTodo;
    partId = todo.id;
  } while (todo);

  const id = todo?.id;

  return (
    <Card classes={{ root: classes.card }}>
      <CardHeader
        action={
          id ? (
            <Button
              variant={"contained"}
              disableRipple
              color="secondary"
              onClick={() => dispatch(toggleTodo({ viewId, id }))}
            >
              Done
            </Button>
          ) : undefined
        }
      />
      <CardContent>
        {noTodos ? (
          <Typography variant="h4" align="center">
            {"Please enter something"}
          </Typography>
        ) : (
          <Typography variant="h2" align="center">
            {todo ? todo.title : "🥳 ALL DONE"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
