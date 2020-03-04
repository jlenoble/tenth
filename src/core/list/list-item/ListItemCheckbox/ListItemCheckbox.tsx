import React, { FunctionComponent } from "react";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

export interface Item {
  id: string;
  checked: boolean;
}

export interface ItemHooks {
  checkItem?: (id: string) => void;
}

export interface Props extends CheckboxProps {
  item: Item;
  itemHooks: ItemHooks;
}

export const ListItemCheckbox: FunctionComponent<Props> = ({
  item: { id, checked },
  itemHooks: { checkItem },
  ...other
}) => (
  <Checkbox
    onClick={checkItem && (() => checkItem(id))}
    checked={checked}
    disableRipple
    {...other}
  />
);
