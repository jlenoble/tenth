import React, { FunctionComponent, PropsWithChildren } from "react";
import { useOnOff } from "./useOnOff";

export type StatelessOnOffProps<T> = ReturnType<typeof useOnOff> & {
  componentProps?: PropsWithChildren<T>;
};
export type StatelessOnOff<T> = FunctionComponent<StatelessOnOffProps<T>>;

export interface StatefulOnOffProps<T> {
  initialValue?: boolean;
  callback?: (value: boolean) => void;
  Component: StatelessOnOff<T>;
  componentProps?: PropsWithChildren<T>;
}

export type StatefulOnOff<T> = FunctionComponent<StatefulOnOffProps<T>>;

export const StatefulOnOff = <T extends {}>({
  initialValue,
  callback,
  Component,
  componentProps
}: PropsWithChildren<StatefulOnOffProps<T>>) => (
  <Component {...useOnOff(initialValue, callback)} {...componentProps} />
);
