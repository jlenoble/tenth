import React, { FunctionComponent } from "react";
import { AddItem, CloseButton } from "./action-components";
import { makeManager } from "./manager";
import { makeCombinedManager } from "./combined-manager";
import { ViewManager } from "./view-manager";
import { List } from "./container-components";

const todosId = "todos";
const todosManager = makeManager(todosId);

const id = (x: any) => x;
const todosViewId = "todosView";
const todosViewManager = todosManager.addMappedChild(todosViewId, id, id);

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
