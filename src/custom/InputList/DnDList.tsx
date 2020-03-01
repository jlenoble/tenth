import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";

import { List } from "../../core";
import { ListItem } from "../list";

import defaultTmpId from "../defaultTmpId";
import useItems, { Item } from "./hooks/useItems";

export interface DnDListProps {
  defaultItems?: Item[];
  onSetItems?: (items: Item[]) => void;
  dnd?: boolean;
  listId?: string;
  itemHooks?: ReturnType<typeof useItems>;
}

const DnDList: FunctionComponent<DnDListProps> = ({
  defaultItems = [],
  onSetItems,
  dnd,
  listId = defaultTmpId(),
  itemHooks
}) => {
  const localItemHooks = useItems(defaultItems, onSetItems);
  if (!itemHooks) {
    itemHooks = localItemHooks;
  }
  const { items } = itemHooks;

  return (
    <Paper>
      <List droppableProps={dnd && { droppableId: listId }}>
        {items.map((item, index) => (
          <ListItem
            key={item.id}
            divider={index !== items.length - 1}
            dnd={dnd}
            index={index}
            item={item}
            itemHooks={itemHooks!}
          />
        ))}
      </List>
    </Paper>
  );
};

export default DnDList;
