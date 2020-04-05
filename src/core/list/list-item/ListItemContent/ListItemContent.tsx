import React, { FunctionComponent } from "react";
import { ListItemCheckbox } from "../ListItemCheckbox/ListItemCheckbox";
import { ListItemDeleteButton } from "../ListItemDeleteButton/ListItemDeleteButton";
import { ListItemText } from "../ListItemText/ListItemText";
import InlineEdit from "../../InlineEdit";
import { RequiredKeys } from "../../../../generics";

export interface Item {
  id: string;
  text: string;
  checked: boolean;
  edited: boolean;
}

export interface ItemHooks {
  checkItem?: (id: string) => void;
  editItem?: (id: string) => void;
  removeItem?: (id: string) => void;
  stopEditing?: () => void;
  updateItem?: (item: RequiredKeys<Partial<Item>, "id">) => void;
  updateItemAndStopEditing?: (item: RequiredKeys<Partial<Item>, "id">) => void;
}

export interface UI {
  checkbox?: boolean;
  deleteButton?: boolean;
  editableText?: boolean;
}

export interface Props {
  item: Item;
  itemHooks?: ItemHooks;
  ui?: UI;
}

export const ListItemContent: FunctionComponent<Props> = ({
  item,
  itemHooks = {},
  ui: { checkbox, deleteButton, editableText } = {},
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
