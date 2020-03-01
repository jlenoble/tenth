import React, { FunctionComponent } from "react";
import {
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps,
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

export type ListItemItem = CheckboxItem & ListItemTextItem & DeleteButtonItem;
export type ListItemItemHooks = CheckboxItemHooks &
  ListItemTextItemHooks &
  DeleteButtonItemHooks;

export interface ListItemContentProps {
  item: ListItemItem;
  itemHooks: ListItemItemHooks;
}

export interface ListItemProps extends BaseListItemProps, ListItemContentProps {
  dnd?: boolean;
  index: number;
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

export const ListItem: FunctionComponent<ListItemProps> = ({
  item,
  itemHooks,
  dnd,
  index,
  ...other
}) => (
  <BaseListItem
    draggableProps={dnd && { draggableId: item.id, index }}
    {...other}
  >
    <ListItemContent item={item} itemHooks={itemHooks} />
  </BaseListItem>
);
