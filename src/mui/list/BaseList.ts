import MuiList, { ListProps as MuiListProps } from "@material-ui/core/List";

export type BaseListProps = MuiListProps;
export type BaseListPropsWithoutRef = Omit<BaseListProps, "ref">;

export default MuiList;
