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
  selectable?: boolean;
  deletable?: boolean;
}

export interface Props {
  item: Item;
  itemHooks: ItemHooks;
  ui?: UI;
}

export const ListItemContent: FunctionComponent<Props> = ({
  item,
  itemHooks,
  ui: { selectable, deletable } = {}
}) => (
  <>
    {selectable && <ListItemCheckbox item={item} itemHooks={itemHooks} />}
    <ListItemText item={item} itemHooks={itemHooks} />
    {deletable && <ListItemDeleteButton item={item} itemHooks={itemHooks} />}
  </>
);
