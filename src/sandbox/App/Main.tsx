import React, { FunctionComponent } from "react";
import { ListItemTextProps } from "../../core";
import { Payload } from "./types";
import { AddItem, CloseButton } from "./action-components";
import { makeManager } from "./manager";
import { makeCombinedManager } from "./combined-manager";
import { ViewManager } from "./view-manager";
import { List } from "./container-components";
import { enableLocalStorage } from "./enable-localstorage";

type Todo = { title: string; completed: boolean };
type TodoView = ListItemTextProps;

const todosId = "todos";
const todosManager = makeManager<Todo>(todosId);

todosManager.addValidator((todo: Todo) => {
  if (!todo.title) {
    return ["Empty string"];
  }
  return [];
});

const adaptToChild = (todo: Payload<Todo>): Payload<TodoView> => {
  return todo.errors
    ? {
        primary: todo.title,
        primaryError: Boolean(todo.errors.length),
        primaryHelperText: todo.errors.join(", ")
      }
    : { primary: todo.title };
};
const adaptToParent = (todoView: Payload<TodoView>): Payload<Todo> => ({
  title: todoView.primary,
  completed: false
});

const todosViewId = "todosView";
const todosViewManager = todosManager.addMappedChild<TodoView>(
  todosViewId,
  adaptToParent,
  adaptToChild
);

enableLocalStorage(todosManager);

export const combinedManager = makeCombinedManager([todosManager]);

export const Main: FunctionComponent = () => {
  return (
    <ViewManager
      key={todosViewId}
      manager={todosViewManager}
      Component={List}
      CreateComponent={AddItem}
      CloseComponent={CloseButton}
    />
  );
};

export default Main;
