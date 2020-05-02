import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Payload, Manager, VisibilityFilter } from "../types";

export interface ContainerComponentProps<T> {
  views: Map<string, Payload<T>>;
  create: (payload: T) => void;
  close: (viewId: string) => void;
  update: (viewId: string, payload: T) => void;
  expand: (viewId: string, expanded: boolean) => void;
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
    actionCreators: { create, destroy, modify, setVisibilityFilter, expand }
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
      expand={(viewId: string, expanded: boolean) => {
        dispatch(expand(viewId, expanded));
      }}
    />
  );
};

export const DualViewManager = <T extends any>({
  manager,
  Component
}: ViewManagerProps<T>) => {
  const {
    stateSelectors: { getItemMap, getSelectionMap },
    progenyHandler
  } = manager;
  const views = useSelector(getItemMap);
  const selections = useSelector(getSelectionMap);
  const expandedViews = Array.from(views).filter(([viewId]) =>
    selections.has(viewId)
  );

  console.log(expandedViews);

  return (
    <Grid container>
      <Grid item xs={12} md={expandedViews.length ? 6 : 12}>
        <ViewManager manager={manager} Component={Component} />
      </Grid>
      {expandedViews.map(([viewId]) => (
        <Grid item key={viewId} xs={12} md={6}>
          <ViewManager
            manager={progenyHandler.getChild(viewId)!}
            Component={Component}
          />
        </Grid>
      ))}
    </Grid>
  );
};
