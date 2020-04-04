import React, { FunctionComponent } from "react";
import * as Checkbox from "../ListItemCheckbox/ListItemCheckbox";
import * as DeleteButton from "../ListItemDeleteButton/ListItemDeleteButton";
import * as EditableText from "../ListItemEditableText/ListItemEditableText";
import * as Text from "../ListItemText/ListItemText";
import InlineEdit from "../../InlineEdit";

const ListItemCheckbox = Checkbox.ListItemCheckbox;
//const ListItemEditableText = EditableText.ListItemEditableText;
const ListItemText = Text.ListItemText;
const ListItemDeleteButton = DeleteButton.ListItemDeleteButton;

export type Item = Checkbox.Item & DeleteButton.Item & EditableText.Item;
export type ItemHooks = Checkbox.ItemHooks &
  DeleteButton.ItemHooks &
  EditableText.ItemHooks;

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
