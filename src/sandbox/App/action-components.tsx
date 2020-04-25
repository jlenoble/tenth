import React, { FunctionComponent } from "react";
import {
  AddButton as CoreAddButton,
  CloseButton as CoreCloseButton,
  useAddItem,
  AddItem as CoreAddItem
} from "../../core";

export type ActionComponent = FunctionComponent<{
  action: <T extends {}>(payload?: T) => void;
}>;

export const AddButton: ActionComponent = ({ action }) => {
  return <CoreAddButton onClick={action} />;
};

export const CloseButton: ActionComponent = ({ action }) => {
  return <CoreCloseButton onClick={action} />;
};

export const AddItem: ActionComponent = ({ action }) => {
  const { value, changeInput, clearInputAndAdd, keyInput } = useAddItem(action);

  return (
    <CoreAddItem
      value={value}
      onChange={changeInput}
      onKeyPress={keyInput}
      buttonProps={{ onClick: clearInputAndAdd }}
    />
  );
};
