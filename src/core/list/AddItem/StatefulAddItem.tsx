import React, { FunctionComponent, KeyboardEvent } from "react";
import { AddItem } from "./AddItem";
import { ItemHooks } from "../List";
import { StatefulAddItem as AddItemWrapper } from "../../base";

export interface Props {
  tmpId: () => string;
  itemHooks?: ItemHooks;
}

export const StatefulAddItem: FunctionComponent<Props> = ({
  tmpId,
  itemHooks = {}
}) => {
  const { addItem } = itemHooks;
  const add = (value: string) => {
    addItem &&
      addItem({
        id: tmpId(),
        text: value,
        checked: false,
        edited: false
      });
  };

  return <AddItemWrapper add={add} AddItem={AddItem} />;
};
