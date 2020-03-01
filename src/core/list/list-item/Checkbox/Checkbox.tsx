import React, { FunctionComponent } from "react";
import {
  default as BaseCheckbox,
  CheckboxProps as BaseCheckboxProps
} from "@material-ui/core/Checkbox";

export interface CheckboxItem {
  id: string;
  checked: boolean;
}

export interface CheckboxItemHooks {
  checkItem: (id: string) => void;
}

export interface CheckboxProps extends BaseCheckboxProps {
  item: CheckboxItem;
  itemHooks: CheckboxItemHooks;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
  item: { id, checked },
  itemHooks: { checkItem },
  ...other
}) => (
  <BaseCheckbox
    onClick={() => checkItem(id)}
    checked={checked}
    disableRipple
    {...other}
  />
);
