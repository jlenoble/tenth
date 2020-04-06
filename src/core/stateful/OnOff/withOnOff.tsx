import React, { PropsWithChildren } from "react";
import OnOff, { StatelessOnOff } from "./OnOff";

export const withOnOff = <T extends {}>(Component: StatelessOnOff<T>) => {
  type OnOffProps<T> = {
    initialValue?: boolean;
    callback?: (value: boolean) => void;
  } & PropsWithChildren<T>;

  const WrappedComponent = ({
    initialValue,
    callback,
    ...componentProps
  }: OnOffProps<T>) => (
    <OnOff
      initialValue={initialValue}
      callback={callback}
      Component={Component}
      {...(componentProps as PropsWithChildren<T>)}
    />
  );

  const displayName = Component.displayName || Component.name || "Component";

  WrappedComponent.displayName = /^Stateful/.test(displayName)
    ? displayName
    : "Stateful" + displayName;

  return WrappedComponent;
};

export default withOnOff;