import React, { FunctionComponent } from "react";
import { StatefulCheckbox as Checkbox } from "../../../stateless";

export interface Item {
  id: string;
  checked: boolean;
}

export interface ItemHooks {
  checkItem?: (id: string) => void;
}

export interface Props {
  item: Item;
  itemHooks: ItemHooks;
}

export const ListItemCheckbox: FunctionComponent<Props> = ({
  item: { id, checked },
  itemHooks: { checkItem }
}) => {
  const toggle = () => {
    checkItem && checkItem(id);
  };

  return <Checkbox initialValue={checked} callback={toggle} />;
};
