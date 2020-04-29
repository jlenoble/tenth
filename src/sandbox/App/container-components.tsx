import React from "react";
import { ListItem, ListItemTextProps } from "../../core";
import { List as MuiList } from "../../mui-base";
import { ContainerComponentProps } from "./view-manager";

export const List = ({
  views,
  create,
  close,
  update,
  CreateComponent
}: ContainerComponentProps<ListItemTextProps>) => {
  return (
    <>
      <CreateComponent
        action={(input: string = "") => create({ primary: input })}
      />
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
