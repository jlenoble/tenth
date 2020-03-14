import React, { FunctionComponent, KeyboardEvent } from "react";
import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField";
import { useInputValue } from "../../../../core";
import { RequiredKeys } from "../../../../generics";

export interface Item {
  id: string;
  text: string;
}

export interface ItemHooks {
  stopEditing?: () => void;
  updateItem?: (item: RequiredKeys<Partial<Item>, "id">) => void;
  updateItemAndStopEditing?: (item: RequiredKeys<Partial<Item>, "id">) => void;
}

export interface Props extends StandardTextFieldProps {
  item: Item;
  itemHooks: ItemHooks;
}

export const ListItemTextField: FunctionComponent<Props> = ({
  item,
  itemHooks,
  ...other
}) => {
  const { inputValue, changeInput, keyInput } = useInputValue(item.text);
  const { stopEditing, updateItemAndStopEditing } = itemHooks;

  return (
    <TextField
      defaultValue={inputValue}
      fullWidth
      onChange={changeInput}
      onBlur={stopEditing}
      onKeyPress={
        updateItemAndStopEditing &&
        ((event: KeyboardEvent<HTMLInputElement>) =>
          keyInput(event, (text: string) => {
            updateItemAndStopEditing({ ...item, text });
          }))
      }
      {...other}
    />
  );
};
