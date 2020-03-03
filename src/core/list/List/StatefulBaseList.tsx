import React, { FunctionComponent } from "react";
import { Item } from "./item";
import { BaseList, Props as BaseListProps } from "./BaseList";
import { useItems, OnSetItems } from "./hooks";

export interface Props extends Omit<BaseListProps, "itemHooks"> {
  defaultItems?: Item[];
  onSetItems?: OnSetItems;
}

export const StatefulList: FunctionComponent<Props> = ({
  defaultItems = [],
  onSetItems,
  ...other
}) => {
  const itemHooks = useItems(defaultItems, onSetItems);

  return <BaseList itemHooks={itemHooks} {...other} />;
};
