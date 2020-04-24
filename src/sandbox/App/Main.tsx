import React, { FunctionComponent } from "react";
import { combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader } from "@material-ui/core";
import { AddButton, CloseButton } from "../../core";
import { makeReducer, create, close } from "./view";

type ActionComponent = FunctionComponent<{ action: () => void }>;

const Add: ActionComponent = ({ action }) => {
  return <AddButton onClick={action} />;
};

const Close: ActionComponent = ({ action }) => {
  return <CloseButton onClick={action} />;
};

export const combinedReducer = combineReducers<{
  [managerId: string]: ReturnType<typeof makeReducer>;
}>({
  m1: makeReducer("m1"),
  m2: makeReducer("m2")
});

interface ViewManagerProps {
  managerId: string;
  create: typeof create;
  close: typeof close;
  getState: (state: {
    [managerId: string]: ReturnType<typeof makeReducer>;
  }) => ReturnType<typeof makeReducer>;
  Component: FunctionComponent<ViewManagerImplProps>;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

interface ViewManagerImplProps {
  views: ReturnType<typeof makeReducer>;
  create: () => void;
  close: (viewId: string) => void;
  CreateComponent: ActionComponent;
  CloseComponent: ActionComponent;
}

const ViewManager: FunctionComponent<ViewManagerProps> = ({
  managerId,
  create,
  close,
  getState,
  Component,
  CreateComponent,
  CloseComponent
}) => {
  const dispatch = useDispatch();
  const views = useSelector(getState);

  return (
    <Component
      views={views}
      create={() => {
        dispatch(create({ managerId }));
      }}
      close={(viewId: string) => {
        dispatch(close({ managerId, viewId }));
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

export const Main: FunctionComponent = () => {
  const managerIds = ["m1", "m2"];

  return (
    <>
      {managerIds.map((managerId) => (
        <ViewManager
          key={managerId}
          managerId={managerId}
          create={create}
          close={close}
          getState={(state) => state[managerId]}
          Component={CardManager}
          CreateComponent={Add}
          CloseComponent={Close}
        />
      ))}
    </>
  );
};

export default Main;
