import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import defaultTmpId from "../defaultTmpId";
import { List, ListProps, Item, useItems } from "../../core";

export interface Props extends Partial<ListProps> {
  defaultItems?: Item[];
  onSetItems?: (items: Item[]) => void;
}

const InputList: FunctionComponent<Props> = ({
  defaultItems = [],
  onSetItems,
  tmpId = defaultTmpId,
  listId = defaultTmpId(),
  itemHooks,
  ...other
}) => {
  const localItemHooks = useItems(defaultItems, onSetItems);
  const childHooks = itemHooks || localItemHooks;

  return (
    <Paper>
      <List
        tmpId={tmpId}
        listId={listId}
        itemHooks={childHooks}
        listItemUI={{
          selectable: true,
          deletable: true
        }}
        ui={{ addItem: true }}
        {...other}
      />
    </Paper>
  );
};

export default InputList;
