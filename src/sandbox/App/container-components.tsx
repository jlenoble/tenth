import React from "react";
import { ListItem } from "./item-components";
import { ListItemText, ListItemTextProps } from "../../core";
import { List as MuiList } from "../../mui-base";
import { ContainerComponentProps } from "./view-manager";

export const List = ({
  views,
  create,
  close,
  update,
  CreateComponent,
  CloseComponent
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
            content={
              <ListItemText
                {...payload}
                primaryEnter={(value: string) =>
                  update(itemId, { primary: value })
                }
              />
            }
            close={<CloseComponent action={() => close(itemId)} />}
          />
        ))}
      </MuiList>
    </>
  );
};
