import React, { FunctionComponent } from "react";
import { BaseList } from "./BaseList";
import { InputList, Props as InputListProps } from "./InputList";

export interface Props extends InputListProps {
  ui?: UI;
}

export interface UI {
  addItem?: boolean;
}

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
