import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader } from "@material-ui/core";
import { ActionComponent, Add, Close } from "./action-components";
import { makeCombinedManager, ViewMap, Manager } from "./view";

interface ViewManagerProps {
  manager: Manager;
  Component: FunctionComponent<ViewManagerImplProps>;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

interface ViewManagerImplProps {
  views: ViewMap;
  create: () => void;
  close: (viewId: string) => void;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

const ViewManager: FunctionComponent<ViewManagerProps> = ({
  manager,
  Component,
  CreateComponent,
  CloseComponent
}) => {
  const { getState, create, close } = manager;
  const dispatch = useDispatch();
  const views = useSelector(getState);

  return (
    <Component
      views={views}
      create={() => {
        dispatch(create());
      }}
      close={(viewId: string) => {
        dispatch(close(viewId));
      }}
      CreateComponent={CreateComponent}
      CloseComponent={CloseComponent}
    />
  );
};

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
