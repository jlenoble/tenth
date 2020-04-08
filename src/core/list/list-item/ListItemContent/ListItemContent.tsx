import React, { FunctionComponent } from "react";
import { ListItemCheckbox } from "../ListItemCheckbox/ListItemCheckbox";
import { ListItemText } from "../ListItemText/ListItemText";
import InlineEdit from "../../InlineEdit";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import { Item, ItemHooks, UI } from "../../types";

export interface Props {
  item: Item;
  itemHooks: ItemHooks;
  ui?: UI;
}

export const ListItemContent: FunctionComponent<Props> = ({
  item,
  itemHooks,
  ui: { checkbox, deleteButton, editableText } = {}
}) => {
  const { id } = item;
  const { removeItem } = itemHooks;

  return (
    <>
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
    </>
  );
};
