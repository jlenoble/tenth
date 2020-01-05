import React, { FunctionComponent } from "react";
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";

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
    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <li
        className={className}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {children}
      </li>
    )}
  </Draggable>
);

export default DraggableListItem;
