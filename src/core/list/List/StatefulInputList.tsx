import React, { FunctionComponent } from "react";
import { Item } from "./item";
import { InputList, Props as InputListProps } from "./InputList";
import { useItems, OnSetItems } from "./hooks";

export interface Props extends Omit<InputListProps, "itemHooks"> {
  defaultItems?: Item[];
  onSetItems?: OnSetItems;
}

export const StatefulInputList: FunctionComponent<Props> = ({
  defaultItems = [],
  onSetItems,
  ...other
}) => {
  const itemHooks = useItems(defaultItems, onSetItems);

  return <InputList itemHooks={itemHooks} {...other} />;
};
