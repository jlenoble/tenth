import React, { FunctionComponent } from "react";
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import clsx from "clsx";
import BaseListItem, {
  BaseListItemPropsWithoutRef
} from "../../mui/list/BaseListItem";

export type DraggablePropsWithoutChildren = Omit<DraggableProps, "children">;

export interface DraggableListItemProps extends BaseListItemPropsWithoutRef {
  draggableProps: DraggablePropsWithoutChildren;
}

const DraggableListItem: FunctionComponent<DraggableListItemProps> = ({
  children,
  className,
  draggableProps,
  ...other
}) => (
  <Draggable {...draggableProps}>
    {(
      { innerRef, draggableProps, dragHandleProps }: DraggableProvided,
      { isDragging }: DraggableStateSnapshot
    ) => (
      <BaseListItem
        className={clsx(className, { isDragging })}
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        {...other}
      >
        {children}
      </BaseListItem>
    )}
  </Draggable>
);

export default DraggableListItem;
