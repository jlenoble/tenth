import React, { FunctionComponent } from "react";
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import clsx from "clsx";
import { BaseListItem, BaseListItemPropsWithoutRef } from "./BaseListItem";

export type DraggablePropsWithoutChildren = Omit<DraggableProps, "children">;

export interface DraggableListItemProps extends BaseListItemPropsWithoutRef {
  draggableProps: DraggablePropsWithoutChildren;
}

export const DraggableListItem: FunctionComponent<DraggableListItemProps> = ({
  children,
  className,
  draggableProps,
  ...other
}) => (
  <Draggable {...draggableProps}>
    {(
      { innerRef, draggableProps, dragHandleProps }: DraggableProvided,
      { isDragging }: DraggableStateSnapshot
    ): JSX.Element => (
      <BaseListItem
        className={clsx(className, { isDragging })}
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        role="listitem"
        draggable
        {...other}
      >
        {children}
      </BaseListItem>
    )}
  </Draggable>
);
