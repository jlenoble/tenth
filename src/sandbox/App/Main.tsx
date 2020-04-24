import React, { FunctionComponent } from "react";
import { Card, CardHeader } from "@material-ui/core";
import { Add, Close } from "./action-components";
import { makeCombinedManager } from "./view";
import { ViewManagerImplProps, ViewManager } from "./view-manager";

const CardManager: FunctionComponent<ViewManagerImplProps> = ({
  views,
  create,
  close,
  CreateComponent,
  CloseComponent
}) => {
  const viewIds = Object.keys(views);

  return (
    <>
      {<CreateComponent action={create} />}
      {viewIds.map((viewId) => (
        <Card key={viewId}>
          <CardHeader
            action={<CloseComponent action={() => close(viewId)} />}
          />
        </Card>
      ))}
    </>
  );
};

const managerIds = ["m1", "m2", "m3", "m4"];
export const combinedManager = makeCombinedManager(managerIds);

export const Main: FunctionComponent = () => {
  return (
    <>
      {combinedManager.getManagerIds().map((managerId) => (
        <ViewManager
          key={managerId}
          manager={combinedManager.getManager(managerId)}
          Component={CardManager}
          CreateComponent={Add}
          CloseComponent={Close}
        />
      ))}
    </>
  );
};

export default Main;
