import React, { FunctionComponent } from "react";
import { List as BaseList, ListProps as BaseListProps } from "../../base";
import {
  ListItem,
  Item as BaseItem,
  ItemHooks as BaseItemHooks
} from "../list-item/ListItem/ListItem";

export type Item = BaseItem;
export type ItemHooks = BaseItemHooks & { items: Item[] };

export interface Props extends BaseListProps {
  listId: string;
  itemHooks: ItemHooks;
  dnd?: boolean;
}

export const List: FunctionComponent<Props> = ({
  listId,
  itemHooks,
  dnd,
  ...other
}) => {
  const items = itemHooks.items;
  const lastIndex = items.length - 1;

  return (
    <BaseList droppableProps={dnd && { droppableId: listId }} {...other}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          divider={index !== lastIndex}
          dnd={dnd}
          index={index}
          item={item}
          itemHooks={itemHooks}
        />
      ))}
    </BaseList>
  );
};
