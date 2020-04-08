import React, { FunctionComponent } from "react";
import {
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps
} from "../../../base";
import "./ListItem.css";
import { ListItemCheckbox } from "../ListItemCheckbox/ListItemCheckbox";
import { ListItemText } from "../ListItemText/ListItemText";
import InlineEdit from "../../InlineEdit";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import { Item, ItemHooks, UI } from "../../types";

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
  const { removeItem } = itemHooks;

  return (
    <BaseListItem
      draggableProps={dnd && { draggableId: item.id, index }}
      {...other}
    >
      {checkbox && <ListItemCheckbox item={item} itemHooks={itemHooks} />}

      {editableText ? (
        <InlineEdit item={item} itemHooks={itemHooks} />
      ) : (
        <ListItemText item={item} itemHooks={itemHooks} />
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
