import React, { FunctionComponent } from "react";
import { Item } from "../../mui/list/hooks/useItems";
import {
  default as BaseInputList,
  InputListProps as BaseInputListProps
} from "../../mui/list/InputList";

export const todoListKey = "todolist";

type InputListProps = Omit<BaseInputListProps, "onSetItems">;

const saveItems = (items: Item[]): void => {
  localStorage.setItem(todoListKey, JSON.stringify(items));
};

const InputList: FunctionComponent<InputListProps> = ({ defaultItems }) => (
  <BaseInputList defaultItems={defaultItems} onSetItems={saveItems} />
);

export default InputList;
