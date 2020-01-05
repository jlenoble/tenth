import React, { FunctionComponent } from "react";
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";

// DraggableProps defines a custom type for the "children" property:
// (provided: DraggableProvided, snapshot: DraggableStateSnapshot): React.ReactElement<HTMLElement>
// But we don't want to override the default for a FunctionComponent.
type DraggablePropsWithoutChildren = Omit<DraggableProps, "children">;

const DraggableListItem: FunctionComponent<DraggablePropsWithoutChildren> = ({
  children,
  ...draggableProps
}) => (
  <Draggable {...draggableProps}>
    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <li
        className="tenth"
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
