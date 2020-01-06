import React, { FunctionComponent } from "react";
import {
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd";
import clsx from "clsx";
import BaseList, { BaseListPropsWithoutRef } from "./BaseList";

export type DroppablePropsWithoutChildren = Omit<DroppableProps, "children">;

export interface DroppableListProps extends BaseListPropsWithoutRef {
  droppableProps: DroppablePropsWithoutChildren;
}

const DroppableList: FunctionComponent<DroppableListProps> = ({
  children,
  className,
  droppableProps,
  ...other
}) => (
  <Droppable {...droppableProps}>
    {(
      { innerRef, droppableProps, placeholder }: DroppableProvided,
      { isDraggingOver }: DroppableStateSnapshot
    ) => (
      <BaseList
        className={clsx(className, { isDraggingOver })}
        ref={innerRef}
        {...droppableProps}
        {...other}
      >
        {children}
        {placeholder}
      </BaseList>
    )}
  </Droppable>
);

export default DroppableList;
