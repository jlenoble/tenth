import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";

import { List } from "../list";

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

  return (
    <Paper>
      <List listId={listId} itemHooks={itemHooks} dnd={dnd} />
    </Paper>
  );
};

export default DnDList;
