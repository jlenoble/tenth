import React, { FunctionComponent } from "react";
import {
  Checkbox,
  CheckboxItem,
  CheckboxItemHooks,
  ListItemText,
  ListItemTextItem,
  ListItemTextItemHooks,
  DeleteButton,
  DeleteButtonItem,
  DeleteButtonItemHooks
} from "../../core";

export type ListItemContentItem = CheckboxItem &
  ListItemTextItem &
  DeleteButtonItem;
export type ListItemContentItemHooks = CheckboxItemHooks &
  ListItemTextItemHooks &
  DeleteButtonItemHooks;

export interface ListItemContentProps {
  item: ListItemContentItem;
  itemHooks: ListItemContentItemHooks;
}

export const ListItemContent: FunctionComponent<ListItemContentProps> = ({
  item,
  itemHooks
}) => {
  return (
    <>
      <Checkbox item={item} itemHooks={itemHooks} />
      <ListItemText item={item} itemHooks={itemHooks} />
      <DeleteButton item={item} itemHooks={itemHooks} />
    </>
  );
};
