import React, { FunctionComponent, KeyboardEvent } from "react";

import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

import List from "./List";
import ListItem from "./ListItem";
import AddItem from "./AddItem";

import useInputValue from "./hooks/useInputValue";
import useItems, { Item } from "./hooks/useItems";

let currentId = Date.now();
const defaultTmpId = () => "item" + currentId++;

export interface InputListProps {
  defaultItems: Item[];
  onSetItems?: (items: Item[]) => void;
  tmpId?: () => string;
}

const InputList: FunctionComponent<InputListProps> = ({
  defaultItems,
  onSetItems,
  tmpId = defaultTmpId
}) => {
  const { inputValue, changeInput, clearInput, keyInput } = useInputValue();

  const { items, addItem, checkItem, removeItem } = useItems(
    defaultItems,
    onSetItems
  );

  const clearInputAndAddItem = () => {
    clearInput();
    addItem(inputValue, tmpId());
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
        <List>
          {items.map(({ id, text, checked }, index) => {
            return (
              <ListItem key={id} divider={index !== items.length - 1}>
                <Checkbox
                  onClick={() => checkItem(id)}
                  checked={checked}
                  disableRipple
                />
                <ListItemText primary={text} />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Delete item"
                    onClick={() => removeItem(id)}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Paper>
  );
};

export default InputList;
