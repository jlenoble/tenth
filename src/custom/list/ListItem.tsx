import React, { FunctionComponent } from "react";
import {
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps
} from "../../core";
import {
  ListItemContent,
  ListItemContentProps,
  ListItemContentItem,
  ListItemContentItemHooks
} from "./ListItemContent";

export type ListItemItem = ListItemContentItem;
export type ListItemItemHooks = ListItemContentItemHooks;

export interface ListItemProps extends BaseListItemProps, ListItemContentProps {
  dnd?: boolean;
  index: number;
}

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
