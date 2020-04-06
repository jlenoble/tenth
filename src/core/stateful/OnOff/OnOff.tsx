import React, { FunctionComponent, PropsWithChildren } from "react";
import useOnOff from "./useOnOff";

export type StatelessOnOffProps<T> = ReturnType<typeof useOnOff> & T;
export type StatelessOnOff<T> = FunctionComponent<StatelessOnOffProps<T>>;

export type StatefulOnOffProps<T> = {
  initialValue?: boolean;
  callback?: (value: boolean) => void;
  Component: StatelessOnOff<T>;
} & T;

export type StatefulOnOff<T> = FunctionComponent<StatefulOnOffProps<T>>;

export const StatefulOnOff = <T extends {}>({
  initialValue,
  callback,
  Component,
  ...componentProps
}: PropsWithChildren<StatefulOnOffProps<T>>) => {
  return (
    <Component
      {...useOnOff(initialValue, callback)}
      {...(componentProps as PropsWithChildren<T>)}
    />
  );
};

export default StatefulOnOff;
