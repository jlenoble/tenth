import React, { FunctionComponent, KeyboardEvent } from "react";

import Paper from "@material-ui/core/Paper";

import AddItem from "./AddItem";
import DnDList from "./DnDList";

import useInputValue from "./hooks/useInputValue";
import useItems, { Item } from "./hooks/useItems";

let currentId = Date.now();
export const defaultTmpId = () => "item" + currentId++;

export interface InputListProps {
  defaultItems?: Item[];
  onSetItems?: (items: Item[]) => void;
  tmpId?: () => string;
  dnd?: boolean;
  listId?: string;
  itemHooks?: ReturnType<typeof useItems>;
}

const InputList: FunctionComponent<InputListProps> = ({
  defaultItems = [],
  onSetItems,
  tmpId = defaultTmpId,
  dnd,
  listId = defaultTmpId(),
  itemHooks
}) => {
  const { inputValue, changeInput, clearInput, keyInput } = useInputValue();
  const localItemHooks = useItems(defaultItems, onSetItems);
  const childHooks = itemHooks || localItemHooks;
  const { addItem } = childHooks;

  const clearInputAndAddItem = () => {
    clearInput();
    addItem({ id: tmpId(), text: inputValue });
  };

  return (
    <Paper>
      <AddItem
        inputValue={inputValue}
        onInputChange={changeInput}
        onButtonClick={clearInputAndAddItem}
        onInputKeyPress={(event: KeyboardEvent<HTMLInputElement>) =>
          keyInput(event, clearInputAndAddItem)
        }
      />
      <DnDList
        defaultItems={defaultItems}
        onSetItems={onSetItems}
        tmpId={tmpId}
        dnd={dnd}
        listId={listId}
        itemHooks={childHooks}
      />
    </Paper>
  );
};

export default InputList;
