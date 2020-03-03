import React, { FunctionComponent } from "react";
import { List as BaseList, ListProps as BaseListProps } from "../../base";
import { ItemHooks } from "./item";
import { ListItem, ListItemUI } from "../list-item/ListItem";

export interface Props extends BaseListProps {
  listId: string;
  itemHooks: ItemHooks;
  dnd?: boolean;
  listItemUI?: ListItemUI;
}

export const List: FunctionComponent<Props> = ({
  listId,
  itemHooks,
  dnd,
  listItemUI,
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
          ui={listItemUI}
        />
      ))}
    </BaseList>
  );
};
