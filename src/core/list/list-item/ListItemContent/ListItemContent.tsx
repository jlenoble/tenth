import React, { FunctionComponent } from "react";
import { ListItemCheckbox } from "../ListItemCheckbox/ListItemCheckbox";
import { ListItemDeleteButton } from "../ListItemDeleteButton/ListItemDeleteButton";
import { ListItemText } from "../ListItemText/ListItemText";
import InlineEdit from "../../InlineEdit";
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
}) => (
  <>
    {checkbox && <ListItemCheckbox item={item} itemHooks={itemHooks} />}
    {editableText ? (
      <InlineEdit item={item} itemHooks={itemHooks} />
    ) : (
      <ListItemText item={item} itemHooks={itemHooks} />
    )}
    {deleteButton && <ListItemDeleteButton item={item} itemHooks={itemHooks} />}
  </>
);
