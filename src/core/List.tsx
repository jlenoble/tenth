import React, { FunctionComponent } from "react";
import { CheckboxProps, IconButtonProps } from "@material-ui/core";
import { List as MuiList, ListProps as MuiListProps } from "../mui-base";
import { BaseListItemTextProps } from "./ListItemText";
import { ListItem, ListItemProps } from "./ListItem";
import {
  StatefulAddItem as AddItem,
  StatefulAddItemProps as AddItemProps,
} from "./AddItem";

export interface ListProps {
  droppableId?: string;
  addItemProps?: AddItemProps;
  listItems?: ListItemProps[];
  checkboxProps?: Omit<CheckboxProps, "checked">;
  listItemTextProps?: BaseListItemTextProps;
  deleteButtonProps?: IconButtonProps;
}

export type BaseListProps = MuiListProps;
export type FullListProps = ListProps & BaseListProps;

export const List: FunctionComponent<FullListProps> = ({
  droppableId,
  addItemProps,
  listItems,
  checkboxProps,
  listItemTextProps,
  deleteButtonProps,
  ...other
}) => {
  const dnd = Boolean(droppableId);
  const droppableProps = (dnd && { droppableId }) as
    | false
    | { droppableId: string };

  return (
    <>
      {addItemProps && <AddItem {...addItemProps} />}
      <MuiList droppableProps={droppableProps} {...other}>
        {listItems &&
          listItems.map((listItem, index) => {
            const { itemId, ...other } = listItem;

            return (
              <ListItem
                draggableProps={dnd && { draggableId: itemId, index }}
                key={itemId}
                itemId={itemId}
                checkboxProps={checkboxProps}
                listItemTextProps={listItemTextProps}
                deleteButtonProps={deleteButtonProps}
                {...other}
              />
            );
          })}
      </MuiList>
    </>
  );
};

export default List;
