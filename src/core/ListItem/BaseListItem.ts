import { ListItemProps } from "@material-ui/core/ListItem";

export type BaseListItemProps = ListItemProps<"li", { button?: false }>;
export type BaseListItemPropsWithoutRef = Omit<BaseListItemProps, "ref">;

export { default as BaseListItem } from "@material-ui/core/ListItem";
