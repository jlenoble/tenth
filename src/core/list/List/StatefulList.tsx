import React, { FunctionComponent } from "react";
import { Item } from "./item";
import { List, Props } from "./List";
import { useItems, OnSetItems } from "./hooks";

export interface StatefulListProps extends Omit<Props, "itemHooks"> {
  defaultItems?: Item[];
  onSetItems?: OnSetItems;
}

export const StatefulList: FunctionComponent<StatefulListProps> = ({
  defaultItems = [],
  onSetItems,
  ...other
}) => {
  const itemHooks = useItems(defaultItems, onSetItems);

  return <List itemHooks={itemHooks} {...other} />;
};
