import React, { FunctionComponent } from "react";
import {
  ProtoListProps as StatelessListProps,
  Item,
  OnSetItems,
  useItems
} from "../../core";
import tmpId from "../defaultTmpId";

type ListProps = Omit<StatelessListProps, "itemHooks">;
type DefaultListProps = Partial<ListProps>;
type StatefulListProps = ListProps & {
  defaultItems?: Item[];
  onSetItems?: OnSetItems;
};
type DefaultStatelessListProps = Partial<StatelessListProps>;
type DefaultStatefulListProps = Partial<StatefulListProps>;

type StatelessList = FunctionComponent<StatelessListProps>;
type StatefulList = FunctionComponent<StatefulListProps>;

export type StatelessListWithDefaults = FunctionComponent<
  DefaultStatelessListProps
>;
export type StatefulListWithDefaults = FunctionComponent<
  DefaultStatefulListProps
>;

const withItems = (List: StatelessList) => {
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

const withDefaultListProps = (
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

const withDefaultStatefulListProps = (
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
