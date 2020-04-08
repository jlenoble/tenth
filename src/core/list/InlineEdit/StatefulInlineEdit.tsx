import React, { FunctionComponent } from "react";
import { StatelessInlineEdit } from "../../stateless";
import { Item, ItemHooks } from "../types";
import { StatefulInlineEdit as InlineEditWrapper } from "../../stateful";

export interface Props {
  item: Item;
  itemHooks: ItemHooks;
}

export const StatefulInlineEdit: FunctionComponent<Props> = ({
  item,
  itemHooks = {}
}) => {
  const { updateItem } = itemHooks;
  const update = (value: string) => {
    updateItem && updateItem({ ...item, text: value });
  };

  return (
    <InlineEditWrapper
      initialValue={item.text}
      callback={update}
      InlineEdit={StatelessInlineEdit}
    />
  );
};
