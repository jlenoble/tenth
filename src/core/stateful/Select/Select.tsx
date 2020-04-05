import React, { FunctionComponent } from "react";
import { useSelect } from "./useSelect";

export type StatelessSelectProps = ReturnType<typeof useSelect>;
export type StatelessSelect = FunctionComponent<StatelessSelectProps>;

export interface StatefulSelectProps {
  initialValue: boolean;
  callback: (selected: boolean) => void;
  Select: StatelessSelect;
}

export type StatefulSelect = FunctionComponent<StatefulSelectProps>;

export const StatefulSelect: StatefulSelect = ({
  initialValue,
  callback,
  Select
}) => <Select {...useSelect(initialValue, callback)} />;
