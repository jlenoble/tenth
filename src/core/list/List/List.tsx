import React, { FunctionComponent } from "react";
import { BaseList } from "./BaseList";
import {
  InputList,
  RawListProps as RawInputListProps,
  Props as InputListProps
} from "./InputList";
import { UI } from "../types";

export interface RawListProps extends RawInputListProps, UI {}
export interface Props extends InputListProps, UI {}

export const List: FunctionComponent<Props> = ({ tmpId, ui, ...other }) => {
  if (ui?.addItem) {
    return <InputList tmpId={tmpId} ui={ui} {...other} />;
  }

  return <BaseList ui={ui} {...other} />;
};
