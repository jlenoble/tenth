import React, { FunctionComponent } from "react";
import BaseListItemText, {
  ListItemTextProps
} from "@material-ui/core/ListItemText";

export interface Item {
  text: string;
}

export interface ItemHooks {}

export interface Props extends ListItemTextProps {
  item: Item;
  itemHooks?: ItemHooks;
}

export const ListItemText: FunctionComponent<Props> = ({
  item: { text },
  itemHooks,
  ...other
}) => <BaseListItemText primary={text} {...other} />;
