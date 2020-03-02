import React, { FunctionComponent } from "react";
import {
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps
} from "../../../base";
import {
  ListItemContent,
  Item as ListItemContentItem,
  ItemHooks as ListItemContentItemHooks,
  Props as ListItemContentProps
} from "../ListItemContent/ListItemContent";

export type Item = ListItemContentItem;
export type ItemHooks = ListItemContentItemHooks;

export interface Props extends BaseListItemProps, ListItemContentProps {
  dnd?: boolean;
  index: number;
}

export const ListItem: FunctionComponent<Props> = ({
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
