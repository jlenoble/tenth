import React, { PropsWithChildren } from "react";
import ListUI, { StatelessListUI } from "./ListUI";
import { ListUIInitialValues, ListUICallbacks } from "./useListUI";

export const withListUI = <T extends {}>(Component: StatelessListUI<T>) => {
  type ListUIProps<T> = {
    initialValues?: ListUIInitialValues;
    callbacks?: ListUICallbacks;
  } & PropsWithChildren<T>;

  const WrappedComponent = (props: ListUIProps<T>) => (
    <ListUI {...props} Component={Component} />
  );

  const displayName = Component.displayName || Component.name || "ListUI";

  WrappedComponent.displayName = /^Stateful/.test(displayName)
    ? displayName
    : "Stateful" + displayName;

  return WrappedComponent;
};

export default withListUI;
