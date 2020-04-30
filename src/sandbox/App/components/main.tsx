import React, { FunctionComponent } from "react";
import { ListItemTextProps } from "../../../core";
import { Payload, ManagerRelationship } from "../types";
import { makeManager } from "../manager";
import { makeCombinedManager } from "../combined-manager";
import { ViewManager } from "./view-manager";
import { ListCard as MainView } from "./container-components";
import { enableLocalStorage } from "../enable-localstorage";

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
const todosViewManager = todosManager.addChild<TodoView>(todosViewId, {
  adaptToParent,
  adaptToChild,
  relationship: ManagerRelationship.MAP
});

enableLocalStorage(todosManager);

export const combinedManager = makeCombinedManager([todosManager]);

export const Main: FunctionComponent = () => {
  return (
    <ViewManager
      key={todosViewId}
      manager={todosViewManager}
      Component={MainView}
    />
  );
};

export default Main;
