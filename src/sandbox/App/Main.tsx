import React, { FunctionComponent } from "react";
import { combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { AddButton, CloseButton } from "../../core";
import { makeReducer, create, close } from "./view";

export const combinedReducer = combineReducers({
  m1: makeReducer("m1"),
  m2: makeReducer("m2")
});

type CardManagerIds = "m1" | "m2";

const CardManager: FunctionComponent<{
  managerId: CardManagerIds;
  createAction: JSX.Element;
}> = ({ managerId, createAction }) => {
  const dispatch = useDispatch();
  const cards = useSelector(
    (state: ReturnType<typeof combinedReducer>) => state[managerId]
  );
  const cardIds = Object.keys(cards);

  return (
    <>
      {createAction}
      {cardIds.map((viewId) => (
        <Card key={viewId}>
          <CardHeader
            action={
              <CloseButton
                onClick={() => dispatch(close({ managerId, viewId }))}
              />
            }
          ></CardHeader>
          <CardContent></CardContent>
        </Card>
      ))}
    </>
  );
};

export const Main: FunctionComponent = () => {
  const dispatch = useDispatch();

  return (
    <>
      <CardManager
        managerId={"m1"}
        createAction={
          <AddButton onClick={() => dispatch(create({ managerId: "m1" }))} />
        }
      />
      <CardManager
        managerId={"m2"}
        createAction={
          <AddButton onClick={() => dispatch(create({ managerId: "m2" }))} />
        }
      />
    </>
  );
};

export default Main;
