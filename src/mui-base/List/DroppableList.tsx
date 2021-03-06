import React, { FunctionComponent } from "react";
import {
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import clsx from "clsx";
import { BaseList, BaseListPropsWithoutRef } from "./BaseList";

export type DroppablePropsWithoutChildren = Omit<DroppableProps, "children">;

export interface DroppableListProps extends BaseListPropsWithoutRef {
  droppableProps: DroppablePropsWithoutChildren;
}

export const DroppableList: FunctionComponent<DroppableListProps> = ({
  children,
  className,
  droppableProps,
  ...other
}) => (
  <Droppable {...droppableProps}>
    {(
      { innerRef, droppableProps, placeholder }: DroppableProvided,
      { isDraggingOver }: DroppableStateSnapshot
    ): JSX.Element => (
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
