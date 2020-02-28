import React, { FunctionComponent, KeyboardEvent } from "react";

import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

import List from "../../core/List";
import ListItem from "../../core/ListItem";
import AddItem from "./AddItem";

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

  const { items, addItem, checkItem, removeItem } = itemHooks || localItemHooks;

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
      <Paper>
        <List droppableProps={dnd && { droppableId: listId }}>
          {items.map(({ id, text, checked }, index) => {
            return (
              <ListItem
                key={id}
                divider={index !== items.length - 1}
                draggableProps={dnd && { draggableId: id, index }}
              >
                <Checkbox
                  onClick={() => checkItem(id)}
                  checked={checked}
                  disableRipple
                />
                <ListItemText primary={text} />
                <IconButton
                  aria-label="Delete item"
                  onClick={() => removeItem(id)}
                >
                  <DeleteOutlined />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Paper>
  );
};

export default InputList;
