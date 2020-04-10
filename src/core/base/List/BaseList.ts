import { List, ListProps } from "@material-ui/core";

export type BaseListProps = ListProps;
export type BaseListPropsWithoutRef = Omit<BaseListProps, "ref">;

export { List as BaseList };
