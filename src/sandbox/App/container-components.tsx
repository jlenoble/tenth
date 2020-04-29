import React, { FunctionComponent } from "react";
import {
  ListItem,
  ListItemTextProps,
  useAddItem,
  AddItem as CoreAddItem
} from "../../core";
import { List as MuiList } from "../../mui-base";
import { ContainerComponentProps } from "./view-manager";

type ActionComponent = FunctionComponent<{
  action: <T extends any>(payload?: T) => void;
}>;

const AddItem: ActionComponent = ({ action }) => {
  const { value, changeInput, clearInputAndAdd, keyInput } = useAddItem(action);

  return (
    <CoreAddItem
      value={value}
      onChange={changeInput}
      onKeyPress={keyInput}
      buttonProps={{ onClick: clearInputAndAdd }}
    />
  );
};

export const List = ({
  views,
  create,
  close,
  update
}: ContainerComponentProps<ListItemTextProps>) => {
  return (
    <>
      <AddItem action={(input: string = "") => create({ primary: input })} />
      <MuiList>
        {Array.from(views.entries()).map(([itemId, payload]) => (
          <ListItem
            key={itemId}
            itemId={itemId}
            {...payload}
            primaryEnter={(value: string) => update(itemId, { primary: value })}
            deleteButtonProps={{
              onClick: () => close(itemId)
            }}
          />
        ))}
      </MuiList>
    </>
  );
};
