import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button
} from "@material-ui/core";
import { Todo, toggleTodo } from "./todo";
import { getTodos, useStyles } from "./TodoList";

export function CurrentTodo() {
  const classes = useStyles();
  let todos = useSelector(getTodos);
  const dispatch = useDispatch();
  const todo: Todo | undefined = todos.find((todo) => !todo.completed);

  return (
    <Card classes={{ root: classes.card }}>
      <CardHeader
        action={
          todo && (
            <Button
              variant={"contained"}
              disableRipple
              color="secondary"
              onClick={() => dispatch(toggleTodo(todo.id))}
            >
              Done
            </Button>
          )
        }
      />
      <CardContent>
        {todos.length ? (
          <Typography variant="h2" align="center">
            {todo ? todo.title : "🥳 ALL DONE"}
          </Typography>
        ) : (
          <Typography variant="h4" align="center">
            {"Please enter something"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
