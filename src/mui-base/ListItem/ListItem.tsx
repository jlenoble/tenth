import React, { FunctionComponent } from "react";
import {
  DraggableListItem,
  DraggablePropsWithoutChildren,
} from "./DraggableListItem";
import { BaseListItem, BaseListItemPropsWithoutRef } from "./BaseListItem";

export interface ListItemProps extends BaseListItemPropsWithoutRef {
  draggableProps?: DraggablePropsWithoutChildren | false;
}

export const ListItem: FunctionComponent<ListItemProps> = ({
  children,
  draggableProps,
  ...other
}) => {
  if (draggableProps) {
    return (
      <DraggableListItem draggableProps={draggableProps} {...other}>
        {children}
      </DraggableListItem>
    );
  }

  return <BaseListItem {...other}>{children}</BaseListItem>;
};
