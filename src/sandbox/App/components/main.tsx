import React, { FunctionComponent } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Payload, ManagerRelationship } from "../types";
import { makeManager } from "../manager";
import { makeCombinedManager } from "../combined-manager";
import { ViewManager } from "./view-manager";
import { ListCard as MainView } from "./container-components";
import { enableLocalStorage } from "../enable-localstorage";
import { Todo, TodoView } from "./custom-types";

const todosId = "todos";
const todosManager = makeManager<Todo>(todosId);

todosManager.addValidator((todo: Todo) => {
  if (!todo.title) {
    return ["Empty string"];
  }
  return [];
});

const adaptToChild = (todo: Payload<Todo>): Payload<TodoView> => {
  const childPayload: Payload<TodoView> = {
    checked: todo.completed,
    primary: todo.title
  };

  return todo.errors
    ? {
        ...childPayload,
        primaryError: Boolean(todo.errors.length),
        primaryHelperText: todo.errors.join(", ")
      }
    : childPayload;
};
const adaptToParent = (todoView: Payload<TodoView>): Payload<Todo> => ({
  title: todoView.primary,
  completed: Boolean(todoView.checked)
});

const todosViewId = "todosView";
const todosViewManager = todosManager.progenyHandler.addChild<TodoView>(
  todosViewId,
  {
    adaptToParent,
    adaptToChild,
    relationship: ManagerRelationship.MAP
  }
);

const todosROOTViewId = "todosROOTView";
const todosROOTViewManager = todosViewManager.progenyHandler.addChild<TodoView>(
  todosROOTViewId,
  {
    relationship: ManagerRelationship.FILTER,
    selectionId: "ROOT"
  }
);

enableLocalStorage(todosManager);

export const combinedManager = makeCombinedManager([todosManager]);

export const Main: FunctionComponent = () => {
  return (
    <DragDropContext onDragEnd={(dropResult: DropResult) => {}}>
      <ViewManager
        key={todosROOTViewId}
        manager={todosROOTViewManager}
        Component={MainView}
      />
    </DragDropContext>
  );
};

export default Main;
