import React, { FunctionComponent } from "react";
import { AddItem, CloseButton } from "./action-components";
import { makeCombinedManager } from "./combined-manager";
import { ViewManager } from "./view-manager";
import { List } from "./container-components";

const todosMasterViewId = "todosMasterView";
const managerIds = [todosMasterViewId];
export const combinedManager = makeCombinedManager<string>(managerIds);

export const Main: FunctionComponent = () => {
  const todosMasterViewManager = combinedManager.getManager(todosMasterViewId);

  return (
    <ViewManager
      key={todosMasterViewId}
      manager={todosMasterViewManager}
      Component={List}
      CreateComponent={AddItem}
      CloseComponent={CloseButton}
    />
  );
};

export default Main;
