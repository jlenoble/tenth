import { ListItemText, ListItemTextProps } from "@material-ui/core";

export type BaseListItemTextProps = ListItemTextProps;
export type BaseListItemTextPropsWithoutRef = Omit<
  BaseListItemTextProps,
  "ref"
>;

export const BaseListItemText = ListItemText;