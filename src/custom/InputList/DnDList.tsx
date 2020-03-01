import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";

import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  DeleteButton
} from "../../core";

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
        {items.map((item, index) => {
          const { id } = item;

          return (
            <ListItem
              key={id}
              divider={index !== items.length - 1}
              draggableProps={dnd && { draggableId: id, index }}
            >
              <Checkbox item={item} itemHooks={itemHooks!} />
              <ListItemText item={item} itemHooks={itemHooks!} />
              <DeleteButton item={item} itemHooks={itemHooks!} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default DnDList;
