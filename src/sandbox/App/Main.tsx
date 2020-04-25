import React, { FunctionComponent } from "react";
import { Card, CardHeader } from "@material-ui/core";
import { AddItem, CloseButton } from "./action-components";
import { makeCombinedManager } from "./manager";
import { ViewManagerImplProps, ViewManager } from "./view-manager";

const CardManager = <T extends {}>({
  views,
  create,
  close,
  CreateComponent,
  CloseComponent
}: ViewManagerImplProps<T>) => {
  const viewIds = Array.from(views);

  return (
    <>
      {<CreateComponent action={create} />}
      {viewIds.map(([viewId]) => (
        <Card key={viewId}>
          <CardHeader
            action={<CloseComponent action={() => close(viewId)} />}
          />
        </Card>
      ))}
    </>
  );
};

const managerIds = ["m1", "m2"];
export const combinedManager = makeCombinedManager<string>(managerIds);

export const Main: FunctionComponent = () => {
  return (
    <>
      {combinedManager.mapToArray((_, managerId) => (
        <ViewManager
          key={managerId}
          manager={combinedManager.getManager(managerId)}
          Component={CardManager}
          CreateComponent={AddItem}
          CloseComponent={CloseButton}
        />
      ))}
    </>
  );
};

export default Main;
