import React, { PropsWithChildren } from "react";
import OnOff, { StatelessOnOff } from "./OnOff";

export const withOnOff = <T extends {}>(Component: StatelessOnOff<T>) => {
  interface OnOffProps<T> {
    initialValue?: boolean;
    callback?: (value: boolean) => void;
    componentProps?: PropsWithChildren<T>;
  }

  const WrappedComponent = (props: OnOffProps<T>) => (
    <OnOff {...props} Component={Component} />
  );

  WrappedComponent.displayName =
    "Stateful" + (Component.displayName || Component.name || "Component");

  return WrappedComponent;
};

export default withOnOff;
