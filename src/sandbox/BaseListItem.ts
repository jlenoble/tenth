import MuiListItem, {
  ListItemProps as MuiListItemProps
} from "@material-ui/core/ListItem";

export type BaseListItemProps = MuiListItemProps<"li", { button?: false }>;
export type BaseListItemPropsWithoutRef = Omit<BaseListItemProps, "ref">;

export default MuiListItem;
