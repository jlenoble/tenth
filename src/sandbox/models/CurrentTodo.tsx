import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button
} from "@material-ui/core";
import { getTodos } from "./todo";
import { TodoState } from "./types";
import { toggleTodo } from "./action-creators";
import { useStyles } from "./TodoList";

export function CurrentTodo({ viewId }: { viewId: string }) {
  const classes = useStyles();
  const { views, parts } = useSelector(getTodos);
  const dispatch = useDispatch();

  const partId = views[viewId].partId;
  const todos = parts[partId];
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
              onClick={() => dispatch(toggleTodo({ viewId, id: todo.id }))}
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
