import React, { FunctionComponent } from "react";

import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

import { List, ListItem, Checkbox } from "../../core";

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
  const { items, removeItem } = itemHooks || localItemHooks;

  return (
    <Paper>
      <List droppableProps={dnd && { droppableId: listId }}>
        {items.map((item, index) => {
          const { id, text } = item;

          return (
            <ListItem
              key={id}
              divider={index !== items.length - 1}
              draggableProps={dnd && { draggableId: id, index }}
            >
              <Checkbox item={item} itemHooks={itemHooks || localItemHooks} />
              <ListItemText primary={text} />
              <IconButton
                aria-label="Delete item"
                onClick={() => removeItem(id)}
              >
                <DeleteOutlined />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default DnDList;
