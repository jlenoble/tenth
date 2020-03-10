import React, { FunctionComponent } from "react";
import { ProtoListProps, Item, OnSetItems, useItems } from "../../core";
import tmpId from "../defaultTmpId";

export type StatelessListProps = ProtoListProps;
export type ListProps = Omit<StatelessListProps, "itemHooks">;
export type DefaultListProps = Partial<ListProps>;
export type StatefulListProps = ListProps & {
  defaultItems?: Item[];
  onSetItems?: OnSetItems;
};
export type DefaultStatelessListProps = Partial<StatelessListProps>;
export type DefaultStatefulListProps = Partial<StatefulListProps>;

export type StatelessList = FunctionComponent<StatelessListProps>;
export type StatefulList = FunctionComponent<StatefulListProps>;

export type StatelessListWithDefaults = FunctionComponent<
  DefaultStatelessListProps
>;
export type StatefulListWithDefaults = FunctionComponent<
  DefaultStatefulListProps
>;

export const withItems = (List: StatelessList) => {
  const WrappedList: StatefulList = ({
    defaultItems,
    onSetItems,
    ...other
  }) => {
    const itemHooks = useItems(defaultItems, onSetItems);
    return <List {...other} itemHooks={itemHooks} />;
  };

  WrappedList.displayName =
    "Stateful" + (List.displayName || List.name || "List");

  return WrappedList;
};

export const withDefaultListProps = (
  List: StatelessList,
  defaultProps: DefaultListProps,
  prefix: string = ""
) => {
  const WrappedComponent: StatelessListWithDefaults = props => (
    <List tmpId={tmpId} {...defaultProps} {...props} />
  );

  WrappedComponent.displayName =
    prefix + (List.displayName || List.name || "List");

  return WrappedComponent;
};

export const withDefaultStatefulListProps = (
  List: StatelessList,
  defaultProps: DefaultListProps,
  prefix: string = ""
) => {
  const ListWithItems = withItems(List);

  const WrappedComponent: StatefulListWithDefaults = props => {
    return <ListWithItems tmpId={tmpId} {...defaultProps} {...props} />;
  };

  WrappedComponent.displayName =
    "Stateful" + prefix + (List.displayName || List.name || "List");

  return WrappedComponent;
};

export type Props = Omit<StatefulListProps, "tmpId">;

export const makeListComponents = (
  List: StatelessList,
  defaultProps: DefaultListProps,
  prefix: string = ""
) => ({
  StatelessList: withDefaultListProps(List, defaultProps, prefix),
  StatefulList: withDefaultStatefulListProps(List, defaultProps, prefix)
});
