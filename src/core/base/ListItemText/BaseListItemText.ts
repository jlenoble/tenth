import { ListItemTextProps } from "@material-ui/core/ListItemText";

export type BaseListItemTextProps = ListItemTextProps;
export type BaseListItemTextPropsWithoutRef = Omit<
  BaseListItemTextProps,
  "ref"
>;

export { default as BaseListItemText } from "@material-ui/core/ListItemText";
