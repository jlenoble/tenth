import React, { FunctionComponent } from "react";
import { useOnOff } from "./useOnOff";

export type StatelessOnOffProps = ReturnType<typeof useOnOff>;
export type StatelessOnOff = FunctionComponent<StatelessOnOffProps>;

export interface StatefulOnOffProps {
  initialValue?: boolean;
  callback?: (value: boolean) => void;
  Component: StatelessOnOff;
}

export type StatefulOnOff = FunctionComponent<StatefulOnOffProps>;

export const StatefulOnOff: StatefulOnOff = ({
  initialValue,
  callback,
  Component
}) => <Component {...useOnOff(initialValue, callback)} />;
