import React, { FunctionComponent } from "react";
import DraggableListItem, {
  DraggablePropsWithoutChildren
} from "../../mui/list/DraggableListItem";
import BaseListItem, {
  BaseListItemPropsWithoutRef
} from "../../mui/list/BaseListItem";

export interface ListItemProps extends BaseListItemPropsWithoutRef {
  draggableProps?: DraggablePropsWithoutChildren | false;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  children,
  draggableProps,
  ...other
}) => {
  if (draggableProps) {
    return (
      <DraggableListItem draggableProps={draggableProps} {...other}>
        {children}
      </DraggableListItem>
    );
  }

  return <BaseListItem {...other}>{children}</BaseListItem>;
};

export default ListItem;
