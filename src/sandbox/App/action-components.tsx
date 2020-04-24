import React, { FunctionComponent } from "react";
import { AddButton, CloseButton } from "../../core";

export type ActionComponent = FunctionComponent<{ action: () => void }>;

export const Add: ActionComponent = ({ action }) => {
  return <AddButton onClick={action} />;
};

export const Close: ActionComponent = ({ action }) => {
  return <CloseButton onClick={action} />;
};
