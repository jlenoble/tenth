import React, { FunctionComponent } from "react";
import { AddItem, CloseButton } from "./action-components";
import { makeCombinedManager } from "./combined-manager";
import { ViewManagerImplProps, ViewManager } from "./view-manager";
import { ListItem } from "./item-components";
import { ListItemText } from "../../core";

const CardManager = <T extends {}>({
  views,
  create,
  close,
  CreateComponent,
  CloseComponent
}: ViewManagerImplProps<T>) => {
  return (
    <>
      {<CreateComponent action={create} />}
      {Array.from(views).map(([viewId, { payload }]) => (
        <ListItem
          key={viewId}
          content={<ListItemText primary={(payload as unknown) as string} />}
          close={<CloseComponent action={() => close(viewId)} />}
        />
      ))}
    </>
  );
};

const todosMasterViewId = "todosMasterView";
const managerIds = [todosMasterViewId];
export const combinedManager = makeCombinedManager<string>(managerIds);

export const Main: FunctionComponent = () => {
  const todosMasterViewManager = combinedManager.getManager(todosMasterViewId);

  return (
    <ViewManager
      key={todosMasterViewId}
      manager={todosMasterViewManager}
      Component={CardManager}
      CreateComponent={AddItem}
      CloseComponent={CloseButton}
    />
  );
};

export default Main;
