import React from "react";
import { ListItem } from "./item-components";
import { ListItemText, ListItemTextProps } from "../../core";
import { List as MuiList } from "../../mui-base";
import { ContainerComponentProps } from "./view-manager";

export const List = ({
  views,
  create,
  close,
  CreateComponent,
  CloseComponent
}: ContainerComponentProps<ListItemTextProps>) => {
  return (
    <>
      <CreateComponent
        action={(input: string = "") => create({ primary: input })}
      />
      <MuiList>
        {Array.from(views.values()).map(({ itemId, payload }) => (
          <ListItem
            key={itemId}
            content={<ListItemText {...payload} />}
            close={<CloseComponent action={() => close(itemId)} />}
          />
        ))}
      </MuiList>
    </>
  );
};
