import React, { FunctionComponent } from "react";
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import clsx from "clsx";

export type DraggablePropsWithoutChildren = Omit<DraggableProps, "children">;

type DraggableListItemProps = {
  className?: string;
  draggableProps: DraggablePropsWithoutChildren;
};

const DraggableListItem: FunctionComponent<DraggableListItemProps> = ({
  children,
  className,
  draggableProps
}) => (
  <Draggable {...draggableProps}>
    {(
      { innerRef, draggableProps, dragHandleProps }: DraggableProvided,
      { isDragging }: DraggableStateSnapshot
    ) => (
      <li
        className={clsx(className, { isDragging })}
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
      >
        {children}
      </li>
    )}
  </Draggable>
);

export default DraggableListItem;
