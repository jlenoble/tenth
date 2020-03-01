import React, { FunctionComponent } from "react";
import {
  default as BaseListItemText,
  ListItemTextProps as BaseListItemTextProps
} from "@material-ui/core/ListItemText";

export interface ListItemTextItem {
  text: string;
}

export interface ListItemTextItemHooks {}

export interface ListItemTextProps extends BaseListItemTextProps {
  item: ListItemTextItem;
  itemHooks: ListItemTextItemHooks;
}

export const ListItemText: FunctionComponent<ListItemTextProps> = ({
  item: { text },
  itemHooks,
  ...other
}) => <BaseListItemText primary={text} {...other} />;
