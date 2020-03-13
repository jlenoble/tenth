import React, { FunctionComponent } from "react";
import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField";

export interface Item {
  text: string;
}

export interface ItemHooks {}

export interface Props extends StandardTextFieldProps {
  item: Item;
  itemHooks?: ItemHooks;
}

export const ListItemTextField: FunctionComponent<Props> = ({
  item: { text },
  itemHooks,
  ...other
}) => <TextField defaultValue={text} fullWidth {...other} />;
