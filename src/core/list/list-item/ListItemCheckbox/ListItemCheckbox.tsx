import React, { FunctionComponent } from "react";
import { StatefulCheckbox as Checkbox } from "../../../stateless";
import { Item, ItemHooks } from "../../types";

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
