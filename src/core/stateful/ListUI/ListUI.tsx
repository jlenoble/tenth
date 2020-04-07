import React, { FunctionComponent, PropsWithChildren } from "react";
import useListUI, {
  ListUIInitialValues,
  ListUICallbacks,
  ListUIProps
} from "./useListUI";

export type StatelessListUIProps<T = {}> = ListUIProps & T;
export type StatelessListUI<T = {}> = FunctionComponent<
  StatelessListUIProps<T>
>;

export type StatefulListUIProps<T = {}> = {
  initialValues?: ListUIInitialValues;
  callbacks?: ListUICallbacks;
  Component: StatelessListUI<T>;
} & T;

export type StatefulListUI<T = {}> = FunctionComponent<StatefulListUIProps<T>>;

export const StatefulListUI = <T extends {}>({
  initialValues,
  callbacks,
  Component,
  ...componentProps
}: PropsWithChildren<StatefulListUIProps<T>>) => {
  return (
    <Component
      {...useListUI(initialValues, callbacks)}
      {...(componentProps as PropsWithChildren<T>)}
    />
  );
};
export default StatefulListUI;
