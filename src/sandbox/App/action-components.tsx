import React, { FunctionComponent } from "react";
import {
  AddButton,
  CloseButton,
  useAddItem,
  AddItem as CoreAddItem
} from "../../core";

export type ActionComponent = FunctionComponent<{
  action: <T extends {}>(payload?: T) => void;
}>;

export const Add: ActionComponent = ({ action }) => {
  return <AddButton onClick={action} />;
};

export const Close: ActionComponent = ({ action }) => {
  return <CloseButton onClick={action} />;
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
