import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button
} from "@material-ui/core";
import { TodoState, TodoStates, TodosState } from "./types";
import { toggleTodo } from "./action-creators";
import { useStyles } from "./TodoList";

export function CurrentTodo({ viewId }: { viewId: string }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { views, parts } = useSelector(
    (state: { todos: TodosState }) => state.todos
  );

  let partId = views[viewId].partId;
  let todos: TodoStates;
  let todo: TodoState | undefined;
  let noTodos: boolean = true;

  do {
    todos = parts[partId];

    if (!todos) {
      break;
    }

    todo = todos.find((todo) => !todo.checked);
    noTodos = !todos.length;

    if (!todo) {
      break;
    }

    partId = todo.id;
  } while (!noTodos);

  return (
    <Card classes={{ root: classes.card }}>
      <CardHeader
        action={
          todo ? (
            <Button
              variant={"contained"}
              disableRipple
              color="secondary"
              onClick={() => dispatch(toggleTodo({ viewId, id: todo!.id }))}
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
