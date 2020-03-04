import React, { FunctionComponent } from "react";
import { List, ListProps } from "../../base";
import { ItemHooks } from "./item";
import { ListItem, ListItemUI } from "../list-item/ListItem";

export interface Props extends ListProps {
  itemHooks?: ItemHooks;
  droppableId?: string;
  listItemUI?: ListItemUI;
}

export const BaseList: FunctionComponent<Props> = ({
  itemHooks = { items: [] },
  droppableId,
  listItemUI,
  ...other
}) => {
  const items = itemHooks.items || [];
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
          ui={listItemUI}
        />
      ))}
    </List>
  );
};
