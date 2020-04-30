import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Payload, Manager } from "./types/types";

export interface ContainerComponentProps<T> {
  views: Map<string, Payload<T>>;
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
    getItemMap,
    actionCreators: { create, destroy, modify }
  } = manager;
  const dispatch = useDispatch();
  const views = useSelector(getItemMap);

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
