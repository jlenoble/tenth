import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ManagerState as ViewMap } from "./types";
import { Manager } from "./manager";

export interface ContainerComponentProps<T> {
  views: ViewMap<T>;
  create: (payload: T) => void;
  close: (viewId: string) => void;
  update: (viewId: string, payload: T) => void;
}

export interface ViewManagerProps<T> {
  manager: Manager<T>;
  Component: FunctionComponent<ContainerComponentProps<T>>;
}

export const ViewManager = <T extends any>({
  manager,
  Component
}: ViewManagerProps<T>) => {
  const {
    getState,
    actionCreators: { create, destroy, modify }
  } = manager;
  const dispatch = useDispatch();
  const views = useSelector(getState);

  return (
    <Component
      views={views}
      create={(payload: T) => {
        dispatch(create(payload));
      }}
      close={(viewId: string) => {
        dispatch(destroy(viewId));
      }}
      update={(viewId: string, payload: T) => {
        dispatch(modify(viewId, payload));
      }}
    />
  );
};
