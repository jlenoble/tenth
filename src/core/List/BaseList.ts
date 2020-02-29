import { ListProps } from "@material-ui/core/List";

export type BaseListProps = ListProps;
export type BaseListPropsWithoutRef = Omit<BaseListProps, "ref">;

export { default as BaseList } from "@material-ui/core/List";
