import React, { FunctionComponent } from "react";
import { Item, ItemHooks } from "../types";
import {
  StatefulInlineEdit as InlineEditWrapper,
  StatelessInlineEdit as StatelessInlineEditType
} from "../../stateful";
import { ListItemText } from "../../base";

export interface Props {
  item: Item;
  itemHooks: ItemHooks;
}

export const StatelessInlineEdit: StatelessInlineEditType = ({
  inputValue,
  edited,
  changeInput,
  keyInput,
  edit,
  stopEditing
}) => {
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

export const InlineEdit: FunctionComponent<Props> = ({
  item,
  itemHooks = {}
}) => {
  const { updateItem } = itemHooks;
  const update = (value: string) => {
    updateItem && updateItem({ ...item, text: value });
  };

  return (
    <InlineEditWrapper
      initialValue={item.text}
      callback={update}
      InlineEdit={StatelessInlineEdit}
    />
  );
};
