import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionComponent } from "./action-components";
import { ManagerState as ViewMap, Manager } from "./manager";

export interface ContainerComponentProps<T> {
  views: ViewMap<T>;
  create: (payload?: T) => void;
  close: (viewId: string) => void;
  update: (viewId: string, payload: T) => void;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

export interface ViewManagerProps<T> {
  manager: Manager<T>;
  Component: FunctionComponent<ContainerComponentProps<T>>;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

export const ViewManager = <T extends any>({
  manager,
  Component,
  CreateComponent,
  CloseComponent
}: ViewManagerProps<T>) => {
  const { getState, create, destroy, modify } = manager;
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
      update={(viewId: string, payload: T) => {
        dispatch(modify(viewId, payload));
      }}
      CreateComponent={CreateComponent}
      CloseComponent={CloseComponent}
    />
  );
};
