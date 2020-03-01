import React, { FunctionComponent } from "react";
import { List as BaseList, ListProps as BaseListProps } from "../../core";
import { ListItem, ListItemItem, ListItemItemHooks } from "./ListItem";

export type Item = ListItemItem;
export type ItemHooks = ListItemItemHooks & { items: Item[] };

export interface ListProps extends BaseListProps {
  listId: string;
  itemHooks: ItemHooks;
  dnd?: boolean;
}

export const List: FunctionComponent<ListProps> = ({
  listId,
  itemHooks,
  dnd,
  ...other
}) => {
  const items = itemHooks.items;

  return (
    <BaseList droppableProps={dnd && { droppableId: listId }} {...other}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          divider={index !== items.length - 1}
          dnd={dnd}
          index={index}
          item={item}
          itemHooks={itemHooks}
        />
      ))}
    </BaseList>
  );
};
