import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionComponent } from "./action-components";
import { ViewMap, Manager } from "./view";

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
