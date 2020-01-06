import React, { FunctionComponent } from "react";
import {
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd";
import clsx from "clsx";

export type DroppablePropsWithoutChildren = Omit<DroppableProps, "children">;

type DroppableListProps = {
  className?: string;
  droppableProps: DroppablePropsWithoutChildren;
};

const DroppableList: FunctionComponent<DroppableListProps> = ({
  children,
  className,
  droppableProps
}) => (
  <Droppable {...droppableProps}>
    {(
      { innerRef, droppableProps, placeholder }: DroppableProvided,
      { isDraggingOver }: DroppableStateSnapshot
    ) => (
      <ul
        className={clsx(className, { isDraggingOver })}
        ref={innerRef}
        {...droppableProps}
      >
        {children}
        {placeholder}
      </ul>
    )}
  </Droppable>
);

export default DroppableList;
