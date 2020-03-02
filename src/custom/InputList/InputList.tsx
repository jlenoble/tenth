import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import defaultTmpId from "../defaultTmpId";
import AddItem from "./AddItem";
import { ListView, ListProps, Item } from "../list";
import useItems from "./hooks/useItems";

export interface InputListProps extends Omit<ListProps, "listId"> {
  defaultItems?: Item[];
  onSetItems?: (items: Item[]) => void;
  itemHooks: ReturnType<typeof useItems>;
  listId?: string;
  tmpId?: () => string;
}

const InputList: FunctionComponent<InputListProps> = ({
  defaultItems = [],
  onSetItems,
  tmpId = defaultTmpId,
  dnd,
  listId = defaultTmpId(),
  itemHooks
}) => {
  const localItemHooks = useItems(defaultItems, onSetItems);
  const childHooks = itemHooks || localItemHooks;

  return (
    <Paper>
      <AddItem tmpId={tmpId} itemHooks={childHooks} />
      <ListView
        listId={listId}
        itemHooks={childHooks}
        dnd={dnd}
        listItemUI={{
          selectable: true,
          deletable: true
        }}
      />
    </Paper>
  );
};

export default InputList;
