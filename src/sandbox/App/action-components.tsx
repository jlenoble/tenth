import React, { FunctionComponent } from "react";
import {
  AddButton as CoreAddButton,
  useAddItem,
  AddItem as CoreAddItem
} from "../../core";

export type ActionComponent = FunctionComponent<{
  action: <T extends any>(payload?: T) => void;
}>;

export const AddButton: ActionComponent = ({ action }) => {
  return <CoreAddButton onClick={action} />;
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
