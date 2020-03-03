import React, { FunctionComponent } from "react";
import { Item, ItemHooks } from "./item";
import { useItems, OnSetItems } from "./hooks";

export type Props = {
  itemHooks: ItemHooks;
};

export type StatefulProps<Props> = Omit<Props, "itemHooks"> & {
  defaultItems?: Item[];
  onSetItems?: OnSetItems;
};

export const withItems = <P extends Props>(List: FunctionComponent<P>) => {
  const StatefulList: FunctionComponent<StatefulProps<P>> = ({
    defaultItems,
    onSetItems,
    ...other
  }) => {
    const itemHooks = useItems(defaultItems, onSetItems);
    // @ts-ignore TS2322
    return <List itemHooks={itemHooks} {...other} />;
  };

  return StatefulList;
};
