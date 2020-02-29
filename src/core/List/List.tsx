import React, { FunctionComponent } from "react";
import { DroppableList, DroppablePropsWithoutChildren } from "./DroppableList";
import { BaseList, BaseListPropsWithoutRef } from "./BaseList";

export interface ListProps extends BaseListPropsWithoutRef {
  droppableProps?: DroppablePropsWithoutChildren | false;
}

export const List: FunctionComponent<ListProps> = ({
  children,
  droppableProps,
  ...other
}) => {
  if (droppableProps) {
    return (
      <DroppableList droppableProps={droppableProps} {...other}>
        {children}
      </DroppableList>
    );
  }

  return <BaseList {...other}>{children}</BaseList>;
};
