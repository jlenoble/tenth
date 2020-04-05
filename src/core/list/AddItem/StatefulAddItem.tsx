import React, { FunctionComponent } from "react";
import { AddItem } from "../../stateless/AddItem";
import { ItemHooks } from "../List";
import { StatefulAddItem as AddItemWrapper } from "../../stateful";

export interface Props {
  tmpId: () => string;
  itemHooks?: ItemHooks;
}

export const StatefulAddItem: FunctionComponent<Props> = ({
  tmpId,
  itemHooks = {},
}) => {
  const { addItem } = itemHooks;
  const add = (value: string) => {
    addItem &&
      addItem({
        id: tmpId(),
        text: value,
        checked: false,
        edited: false,
      });
  };

  return <AddItemWrapper add={add} AddItem={AddItem} />;
};
