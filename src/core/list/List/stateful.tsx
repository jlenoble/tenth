import React, { FunctionComponent, PropsWithChildren } from "react";
import { Item, ItemHooks } from "./item";
import { useItems, OnSetItems } from "./hooks";

export type Props = {
  itemHooks?: ItemHooks;
};

export type StatefulProps<P> = Omit<P, "itemHooks"> & {
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

    // Wrongly typing "other" as PropsWithChildren<P> to get rid of error TS2322:
    // "other" is exactly P, +"children", -"itemHooks", but Typescript complains
    // about potential wrong subtype.
    return <List {...(other as PropsWithChildren<P>)} itemHooks={itemHooks} />;
  };

  return StatefulList;
};
