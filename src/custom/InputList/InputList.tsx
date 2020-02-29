import React, { FunctionComponent, KeyboardEvent } from "react";

import Paper from "@material-ui/core/Paper";

import defaultTmpId from "./defaultTmpId";
import AddItem from "./AddItem";
import DnDList, { DnDListProps } from "./DnDList";

import useInputValue from "./hooks/useInputValue";
import useItems from "./hooks/useItems";

export interface InputListProps extends DnDListProps {
  tmpId?: () => string;
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
        dnd={dnd}
        listId={listId}
        itemHooks={childHooks}
      />
    </Paper>
  );
};

export default InputList;
