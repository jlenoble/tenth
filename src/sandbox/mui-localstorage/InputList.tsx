import React, { FunctionComponent, KeyboardEvent } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import AddItem from "../../mui/list/AddItem";
import useInputValue from "./hooks/useInputValue";
import useItems, { Item } from "./hooks/useItems";

let currentId = 0;
const tmpId = () => "item" + currentId++;

interface InputListProps {
  defaultItems: Item[];
}

const InputList: FunctionComponent<InputListProps> = ({ defaultItems }) => {
  const { inputValue, changeInput, clearInput, keyInput } = useInputValue();
  const { items, addItem, checkItem, removeItem } = useItems(defaultItems);

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
