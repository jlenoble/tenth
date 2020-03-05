import React, { FunctionComponent } from "react";
import { BaseList } from "./BaseList";
import {
  InputList,
  RawListProps as RawInputListProps,
  Props as InputListProps
} from "./InputList";

export interface UI {
  addItem?: boolean;
}

interface UIProps {
  ui?: UI;
}

export interface RawListProps extends RawInputListProps, UIProps {}
export interface Props extends InputListProps, UIProps {}

export const List: FunctionComponent<Props> = ({
  tmpId,
  ui: { addItem } = {},
  ...other
}) => {
  if (addItem) {
    return <InputList tmpId={tmpId} {...other} />;
  }

  return <BaseList {...other} />;
};
