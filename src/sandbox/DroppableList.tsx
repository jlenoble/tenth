import React, { FunctionComponent } from "react";
import {
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd";

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
    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
      <ul
        className={className}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {children}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
);

export default DroppableList;
