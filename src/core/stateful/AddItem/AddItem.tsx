import React, { FunctionComponent } from "react";
import { useInputValue } from "./useInputValue";

export type StatelessAddItemProps = ReturnType<typeof useInputValue>;
export type StatelessAddItem = FunctionComponent<StatelessAddItemProps>;

export interface StatefulAddItemProps {
  callback: (value: string) => void;
  AddItem: StatelessAddItem;
}

export type StatefulAddItem = FunctionComponent<StatefulAddItemProps>;

export const StatefulAddItem: StatefulAddItem = ({ callback, AddItem }) => (
  <AddItem {...useInputValue(callback)} />
);
