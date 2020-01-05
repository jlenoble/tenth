import React, { FunctionComponent } from "react";
import DraggableListItem, {
  DraggablePropsWithoutChildren
} from "./DraggableListItem";

type ListItemProps = {
  className?: string;
  draggableProps?: DraggablePropsWithoutChildren;
};

const ListItem: FunctionComponent<ListItemProps> = ({
  children,
  className,
  draggableProps
}) => {
  if (draggableProps) {
    return (
      <DraggableListItem className={className} draggableProps={draggableProps}>
        {children}
      </DraggableListItem>
    );
  }

  return <li className={className}>{children}</li>;
};

export default ListItem;
