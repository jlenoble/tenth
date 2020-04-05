import React, { FunctionComponent } from "react";
import { useInputValue } from "./useInputValue";

export type StatelessAddItemProps = ReturnType<typeof useInputValue>;
export type StatelessAddItem = FunctionComponent<StatelessAddItemProps>;

export interface StatefulAddItemProps {
  add: (value: string) => void;
  AddItem: StatelessAddItem;
}

export type StatefulAddItem = FunctionComponent<StatefulAddItemProps>;

export const StatefulAddItem: StatefulAddItem = ({ add, AddItem }) => (
  <AddItem {...useInputValue(add)} />
);
