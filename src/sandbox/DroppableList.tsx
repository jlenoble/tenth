import React, { FunctionComponent } from "react";
import {
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd";

// DroppableProps defines a custom type for the "children" property:
// (provided: DroppableProvided, snapshot: DroppableStateSnapshot): React.ReactElement<HTMLElement>
// But we don't want to override the default for a FunctionComponent.
type DroppablePropsWithoutChildren = Omit<DroppableProps, "children">;

const DroppableList: FunctionComponent<DroppablePropsWithoutChildren> = ({
  children,
  ...droppableProps
}) => (
  <Droppable {...droppableProps}>
    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
      <ul
        className="tenth"
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
