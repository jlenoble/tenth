import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button
} from "@material-ui/core";
import { TodosState } from "./types";
import { toggleTodo } from "./action-creators";
import { useStyles } from "./TodoList";

export function CurrentTodo({ viewId }: { viewId: string }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const partId = useSelector(
    (state: { todos: TodosState }) => state.todos.views[viewId].partId
  );

  const todo = useSelector((state: { todos: TodosState }) =>
    state.todos.parts[partId].find((todo) => !todo.checked)
  );

  const noTodos = useSelector(
    (state: { todos: TodosState }) => !state.todos.parts[partId].length
  );

  return (
    <Card classes={{ root: classes.card }}>
      <CardHeader
        action={
          todo && (
            <Button
              variant={"contained"}
              disableRipple
              color="secondary"
              onClick={() => dispatch(toggleTodo({ viewId, id: todo.id }))}
            >
              Done
            </Button>
          )
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
