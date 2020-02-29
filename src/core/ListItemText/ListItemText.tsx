import React, { FunctionComponent } from "react";
import {
  default as BaseListItemText,
  ListItemTextProps as BaseListItemTextProps
} from "@material-ui/core/ListItemText";

export interface ListItemTextItem {
  text: string;
}

export interface ListItemTextProps extends BaseListItemTextProps {
  item: ListItemTextItem;
}

export const ListItemText: FunctionComponent<ListItemTextProps> = ({
  item: { text },
  ...other
}) => <BaseListItemText primary={text} {...other} />;
