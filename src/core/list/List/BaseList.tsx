import React, { FunctionComponent } from "react";
import { List, ListProps } from "../../base";
import { ListItem } from "../list-item/ListItem";
import { Item, ItemHooks, UI } from "../types";

export interface RawListProps {
  itemHooks: ItemHooks;
  droppableId?: string;
  ui?: UI;
}

export interface Props extends RawListProps, ListProps {}

export const BaseList: FunctionComponent<Props> = ({
  itemHooks,
  droppableId,
  ui,
  ...other
}) => {
  const items: Item[] = itemHooks.items || [];
  const lastIndex = items.length - 1;
  const dnd = Boolean(droppableId);
  const droppableProps = (dnd && { droppableId }) as
    | false
    | { droppableId: string };

  return (
    <List droppableProps={droppableProps} {...other}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          divider={index !== lastIndex}
          dnd={dnd}
          index={index}
          item={item}
          itemHooks={itemHooks}
          ui={ui}
        />
      ))}
    </List>
  );
};
