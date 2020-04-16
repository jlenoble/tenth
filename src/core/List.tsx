import React, { FunctionComponent } from "react";
import {
  List as MuiList,
  ListProps as MuiListProps,
  CheckboxProps,
  IconButtonProps
} from "@material-ui/core";
import { BaseListItemTextProps } from "./ListItemText";
import { ListItem, ListItemProps } from "./ListItem";

export interface ListProps {
  listItems?: ListItemProps[];
  checkboxProps?: Omit<CheckboxProps, "checked">;
  listItemTextProps?: BaseListItemTextProps;
  deleteButtonProps?: IconButtonProps;
}

export type BaseListProps = MuiListProps;
export type FullListProps = ListProps & BaseListProps;

export const List: FunctionComponent<FullListProps> = ({
  listItems,
  checkboxProps,
  listItemTextProps,
  deleteButtonProps,
  ...other
}) => {
  return (
    <MuiList {...other}>
      {listItems &&
        listItems.map((listItem) => (
          <ListItem
            key={listItem.itemId}
            checkboxProps={checkboxProps}
            listItemTextProps={listItemTextProps}
            deleteButtonProps={deleteButtonProps}
            {...listItem}
          />
        ))}
    </MuiList>
  );
};

export default List;