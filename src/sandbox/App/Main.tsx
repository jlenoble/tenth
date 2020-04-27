import React, { FunctionComponent } from "react";
import { ListItemTextProps } from "../../core";
import { AddItem, CloseButton } from "./action-components";
import { makeManager } from "./manager";
import { makeCombinedManager } from "./combined-manager";
import { ViewManager } from "./view-manager";
import { List } from "./container-components";

type Todo = { title: string; duration: number };
type TodoView = ListItemTextProps;

const todosId = "todos";
const todosManager = makeManager<Todo>(todosId);

const adaptToChild = (todo: Todo): TodoView => ({
  primary: todo.title
});
const adaptToParent = (todoView: TodoView): Todo => ({
  title: todoView.primary,
  duration: 0
});

const todosViewId = "todosView";
const todosViewManager = todosManager.addMappedChild(
  todosViewId,
  adaptToParent,
  adaptToChild
);

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
