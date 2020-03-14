import React, { FunctionComponent } from "react";
import * as Text from "../ListItemText/ListItemText";
import * as TextField from "../ListItemTextField/ListItemTextField";

const ListItemText = Text.ListItemText;
const ListItemTextField = TextField.ListItemTextField;

export type Item = Text.Item & TextField.Item & { id: string; edited: boolean };
export type ItemHooks = Text.ItemHooks &
  TextField.ItemHooks & {
    editItem?: (id: string) => void;
  };

export interface Props extends Text.Props {
  item: Item;
  itemHooks: ItemHooks;
}

export const ListItemEditableText: FunctionComponent<Props> = ({
  item,
  itemHooks
}) => {
  const { editItem } = itemHooks;

  if (item.edited) {
    return <ListItemTextField autoFocus item={item} itemHooks={itemHooks} />;
  }

  return (
    <ListItemText
      item={item}
      itemHooks={itemHooks}
      onDoubleClick={editItem && (() => editItem(item.id))}
    />
  );
};
