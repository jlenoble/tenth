import React from "react";
import { ListItem } from "./item-components";
import { ListItemText } from "../../core";
import { List as MuiList } from "../../mui-base";
import { ContainerComponentProps } from "./view-manager";

export const List = ({
  views,
  create,
  close,
  CreateComponent,
  CloseComponent
}: ContainerComponentProps<string>) => {
  return (
    <>
      <CreateComponent action={create} />
      <MuiList>
        {Array.from(views.values()).map(({ itemId, payload }) => (
          <ListItem
            key={itemId}
            content={<ListItemText primary={payload} />}
            close={<CloseComponent action={() => close(itemId)} />}
          />
        ))}
      </MuiList>
    </>
  );
};
