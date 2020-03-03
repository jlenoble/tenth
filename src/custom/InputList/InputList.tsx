import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import defaultTmpId from "../defaultTmpId";
import {
  InputList as BaseInputList,
  ListProps,
  Item,
  useItems
} from "../../core";

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
      <BaseInputList
        tmpId={tmpId}
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
