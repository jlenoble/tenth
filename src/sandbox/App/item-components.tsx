import React, { FunctionComponent } from "react";
import { ListItem as MuiListItem } from "../../mui-base";

export type ItemComponent = FunctionComponent<{
  content: JSX.Element;
  close: JSX.Element;
}>;

export const ListItem: ItemComponent = ({ content, close }) => {
  return (
    <MuiListItem>
      {content}
      {close}
    </MuiListItem>
  );
};
