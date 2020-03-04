import React, { FunctionComponent, KeyboardEvent } from "react";
import { AddItem } from "./AddItem";
import { useInputValue } from "./hooks";
import { ItemHooks } from "../List";

export interface Props {
  tmpId: () => string;
  itemHooks?: ItemHooks;
}

export const StatefulAddItem: FunctionComponent<Props> = ({
  tmpId,
  itemHooks = {}
}) => {
  const { inputValue, changeInput, clearInput, keyInput } = useInputValue();
  const { addItem } = itemHooks;

  const clearInputAndAddItem = addItem
    ? () => {
        clearInput();
        addItem({ id: tmpId(), text: inputValue, checked: false });
      }
    : clearInput;

  return (
    <AddItem
      inputValue={inputValue}
      onInputChange={changeInput}
      onButtonClick={clearInputAndAddItem}
      onInputKeyPress={(event: KeyboardEvent<HTMLInputElement>) =>
        keyInput(event, clearInputAndAddItem)
      }
    />
  );
};
