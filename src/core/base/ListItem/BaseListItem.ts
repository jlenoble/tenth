import { ListItem, ListItemProps } from "@material-ui/core";

export type BaseListItemProps = ListItemProps<"li", { button?: false }>;
export type BaseListItemPropsWithoutRef = Omit<BaseListItemProps, "ref">;

export { ListItem as BaseListItem };
