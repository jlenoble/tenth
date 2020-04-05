import React, { FunctionComponent } from "react";
import { StatelessAddItem } from "../../stateless";
import { ItemHooks } from "../List";
import { StatefulAddItem as AddItemWrapper } from "../../stateful";

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

  return <AddItemWrapper callback={add} AddItem={StatelessAddItem} />;
};
