import React, { FunctionComponent } from "react";
import DroppableList, { DroppablePropsWithoutChildren } from "./DroppableList";

type ListProps = {
  className?: string;
  droppableProps?: DroppablePropsWithoutChildren;
};

const List: FunctionComponent<ListProps> = ({
  children,
  className,
  droppableProps
}) => {
  if (droppableProps) {
    return (
      <DroppableList className={className} droppableProps={droppableProps}>
        {children}
      </DroppableList>
    );
  }

  return <ul className={className}>{children}</ul>;
};

export default List;
