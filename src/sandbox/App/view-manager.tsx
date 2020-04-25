import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionComponent } from "./action-components";
import { ManagerState as ViewMap, Manager } from "./manager";

export interface ViewManagerProps<T> {
  manager: Manager<T>;
  Component: FunctionComponent<ViewManagerImplProps<T>>;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

export interface ViewManagerImplProps<T> {
  views: ViewMap<T>;
  create: () => void;
  close: (viewId: string) => void;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

export const ViewManager = <T extends {}>({
  manager,
  Component,
  CreateComponent,
  CloseComponent
}: ViewManagerProps<T>) => {
  const { getState, create, destroy } = manager;
  const dispatch = useDispatch();
  const views = useSelector(getState);

  return (
    <Component
      views={views}
      create={(payload?: T) => {
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
