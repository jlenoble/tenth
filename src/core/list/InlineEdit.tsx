import React, { FunctionComponent } from "react";
import { Item, ItemHooks } from "./types";
import { ListItemText } from "../base";
import useEditValue from "../states/useEditValue";

export interface InlineEditProps {
  item: Item;
  itemHooks: ItemHooks;
}

export const InlineEdit: FunctionComponent<InlineEditProps> = ({
  item,
  itemHooks = {}
}) => {
  const { updateItem } = itemHooks;
  const update = (value: string) => {
    updateItem && updateItem({ ...item, text: value });
  };

  const {
    inputValue,
    edited,
    changeInput,
    keyInput,
    edit,
    stopEditing
  } = useEditValue(item.text, update);

  const props = edited
    ? {
        primaryTextFieldProps: {
          autoFocus: true,
          fullWidth: true,
          onChange: changeInput,
          onBlur: stopEditing,
          onKeyPress: keyInput
        }
      }
    : { onClick: edit };

  return <ListItemText primary={inputValue} {...props} />;
};

export default InlineEdit;
