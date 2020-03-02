import React, { FunctionComponent, KeyboardEvent } from "react";
import BaseAddItem from "./BaseAddItem";
import useInputValue from "./hooks/useInputValue";
import { useItems } from "../../core/list";

export interface AddItemProps {
  tmpId: () => string;
  itemHooks: ReturnType<typeof useItems>;
}

const AddItem: FunctionComponent<AddItemProps> = ({ tmpId, itemHooks }) => {
  const { inputValue, changeInput, clearInput, keyInput } = useInputValue();
  const { addItem } = itemHooks;

  const clearInputAndAddItem = () => {
    clearInput();
    addItem({ id: tmpId(), text: inputValue, checked: false });
  };

  return (
    <BaseAddItem
      inputValue={inputValue}
      onInputChange={changeInput}
      onButtonClick={clearInputAndAddItem}
      onInputKeyPress={(event: KeyboardEvent<HTMLInputElement>) =>
        keyInput(event, clearInputAndAddItem)
      }
    />
  );
};

export default AddItem;
