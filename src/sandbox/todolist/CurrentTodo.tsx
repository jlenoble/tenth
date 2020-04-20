import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button
} from "@material-ui/core";
import { TodoState, toggleTodo } from "./todo";
import { getTodos, useStyles } from "./TodoList";

export function CurrentTodo() {
  const classes = useStyles();
  const { todos } = useSelector(getTodos);
  const dispatch = useDispatch();
  const todo: TodoState | undefined = todos.find((todo) => !todo.checked);

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
