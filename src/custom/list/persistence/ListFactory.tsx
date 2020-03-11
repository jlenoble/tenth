import React, { FunctionComponent } from "react";
import { wrapSetItems } from "../../../core";
import {
  withItems,
  StatelessList,
  DefaultListProps,
  StatefulList as BaseStatefulList,
  StatefulListProps as BaseStatefulListProps
} from "../ListFactory";
import { fetch, save } from "./localstorage";
import tmpId from "../../defaultTmpId";

export type StatefulListProps = BaseStatefulListProps & {
  localStorageId: string;
};

export type StatefulList = FunctionComponent<StatefulListProps>;

export type DefaultStatefulListProps = Partial<StatefulListProps> & {
  localStorageId: string;
};

export type StatefulListWithDefaults = FunctionComponent<
  DefaultStatefulListProps
>;

const withLocalStorage = (List: BaseStatefulList): StatefulList => {
  const WrappedList: StatefulList = ({
    defaultItems,
    onSetItems,
    localStorageId,
    ...other
  }) => {
    if (!defaultItems) {
      defaultItems = fetch(localStorageId)();
    }

    const saveItems = save(localStorageId);

    return (
      <List
        {...other}
        defaultItems={defaultItems}
        onSetItems={
          onSetItems ? wrapSetItems(onSetItems, saveItems) : saveItems
        }
      />
    );
  };

  WrappedList.displayName =
    (List.displayName || List.name || "List") + "WithLocalStorage";

  return WrappedList;
};

const withDefaultStatefulListProps = (
  List: StatelessList,
  defaultProps: DefaultListProps,
  prefix: string = ""
) => {
  const ListWithItemsWithLocalStorage = withLocalStorage(withItems(List));

  const WrappedComponent: StatefulListWithDefaults = props => {
    return (
      <ListWithItemsWithLocalStorage
        tmpId={tmpId}
        {...defaultProps}
        {...props}
      />
    );
  };

  WrappedComponent.displayName =
    "Persistent" + prefix + (List.displayName || List.name || "List");

  return WrappedComponent;
};

export type Props = Omit<StatefulListProps, "tmpId">;

export const makeListComponents = (
  List: StatelessList,
  defaultProps: DefaultListProps,
  prefix: string = ""
) => ({
  StatefulList: withDefaultStatefulListProps(List, defaultProps, prefix)
});
