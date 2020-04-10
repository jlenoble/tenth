import React, { FunctionComponent } from "react";
import { Checkbox, ListItemText, IconButton } from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import {
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps
} from "../../base";
import "./ListItem.css";
import InlineEdit from "../InlineEdit";
import { Item, ItemHooks, UI } from "../types";
import { useOnOff } from "../../states";

export interface Props extends BaseListItemProps {
  item: Item;
  itemHooks: ItemHooks;
  ui?: UI;
  dnd?: boolean;
  index: number;
}

export const ListItem: FunctionComponent<Props> = ({
  item,
  itemHooks,
  dnd,
  index,
  ui: { checkbox, deleteButton, editableText } = {},
  ...other
}) => {
  const { id } = item;
  const { removeItem, checkItem } = itemHooks;

  const { state: checkboxState, toggle: toggleCheckbox } = useOnOff(
    item.checked,
    () => checkItem && checkItem(id)
  );

  return (
    <BaseListItem
      draggableProps={dnd && { draggableId: item.id, index }}
      {...other}
    >
      {checkbox && (
        <Checkbox onClick={toggleCheckbox} checked={checkboxState} />
      )}

      {editableText ? (
        <InlineEdit item={item} itemHooks={itemHooks} />
      ) : (
        <ListItemText primary={item.text} />
      )}

      {deleteButton && (
        <IconButton
          aria-label="Delete item"
          onClick={() => removeItem && removeItem(id)}
        >
          <DeleteOutlined />
        </IconButton>
      )}
    </BaseListItem>
  );
};
