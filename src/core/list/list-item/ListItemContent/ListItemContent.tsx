import React, { FunctionComponent } from "react";
import * as Checkbox from "../ListItemCheckbox/ListItemCheckbox";
import * as DeleteButton from "../ListItemDeleteButton/ListItemDeleteButton";
import * as Text from "../ListItemText/ListItemText";

const ListItemCheckbox = Checkbox.ListItemCheckbox;
const ListItemText = Text.ListItemText;
const ListItemDeleteButton = DeleteButton.ListItemDeleteButton;

export type Item = Checkbox.Item & DeleteButton.Item & Text.Item;
export type ItemHooks = Checkbox.ItemHooks &
  DeleteButton.ItemHooks &
  Text.ItemHooks;

export interface UI {
  checkbox?: boolean;
  deleteButton?: boolean;
}

export interface Props {
  item: Item;
  itemHooks?: ItemHooks;
  ui?: UI;
}

export const ListItemContent: FunctionComponent<Props> = ({
  item,
  itemHooks = {},
  ui: { checkbox, deleteButton } = {}
}) => (
  <>
    {checkbox && <ListItemCheckbox item={item} itemHooks={itemHooks} />}
    <ListItemText item={item} itemHooks={itemHooks} />
    {deleteButton && <ListItemDeleteButton item={item} itemHooks={itemHooks} />}
  </>
);
