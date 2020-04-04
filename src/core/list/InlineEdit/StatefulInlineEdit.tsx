import React, { FunctionComponent } from "react";
import { InlineEdit } from "./InlineEdit";
import { ItemHooks } from "../List";
import { StatefulInlineEdit as InlineEditWrapper } from "../../base";

export interface Props {
  item: { id: string; text: string };
  itemHooks?: ItemHooks;
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
      update={update}
      InlineEdit={InlineEdit}
    />
  );
};
