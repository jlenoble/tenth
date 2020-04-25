import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionComponent } from "./action-components";
import { ManagerState as ViewMap, Manager } from "./manager";

export interface ViewManagerProps {
  manager: Manager;
  Component: FunctionComponent<ViewManagerImplProps>;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

export interface ViewManagerImplProps {
  views: ViewMap;
  create: () => void;
  close: (viewId: string) => void;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

export const ViewManager: FunctionComponent<ViewManagerProps> = ({
  manager,
  Component,
  CreateComponent,
  CloseComponent
}) => {
  const { getState, create, destroy } = manager;
  const dispatch = useDispatch();
  const views = useSelector(getState);

  return (
    <Component
      views={views}
      create={<T extends {}>(payload?: T) => {
        dispatch(create(payload));
      }}
      close={(viewId: string) => {
        dispatch(destroy(viewId));
      }}
      CreateComponent={CreateComponent}
      CloseComponent={CloseComponent}
    />
  );
};
