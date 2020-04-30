import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Payload, Manager, VisibilityFilter } from "../types";

export interface ContainerComponentProps<T> {
  views: Map<string, Payload<T>>;
  create: (payload: T) => void;
  close: (viewId: string) => void;
  update: (viewId: string, payload: T) => void;
  visibilityFilter: VisibilityFilter;
  setVisibilityFilter: (visibilityFilter: VisibilityFilter) => void;
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
    stateSelectors: { getItemMap, getVisibilityFilter },
    actionCreators: { create, destroy, modify, setVisibilityFilter }
  } = manager;
  const dispatch = useDispatch();
  const views = useSelector(getItemMap);
  const visibilityFilter = useSelector(getVisibilityFilter);

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
      visibilityFilter={visibilityFilter}
      setVisibilityFilter={(visibilityFilter: VisibilityFilter) =>
        dispatch(setVisibilityFilter(visibilityFilter))
      }
    />
  );
};
