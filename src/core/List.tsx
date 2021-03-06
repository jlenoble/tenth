import React, { FunctionComponent } from "react";
import { CheckboxProps, IconButtonProps } from "@material-ui/core";
import { List as MuiList, ListProps as MuiListProps } from "../mui-base";
import { BaseListItemTextProps } from "./ListItemText";
import { ListItem, ListItemProps } from "./ListItem";
import {
  StatefulAddItem as AddItem,
  StatefulAddItemProps as AddItemProps,
} from "./AddItem";
import { CatchError } from "./ErrorFeedback";

export interface ListProps {
  droppableId?: string;
  addItemProps?: AddItemProps;
  listItems?: ListItemProps[];
  checkboxProps?: Omit<CheckboxProps, "checked">;
  listItemTextProps?: BaseListItemTextProps;
  deleteButtonProps?: IconButtonProps;
  catchError?: CatchError;
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
  catchError,
  ...other
}) => {
  const dnd = Boolean(droppableId);
  const droppableProps = (dnd && { droppableId }) as
    | false
    | { droppableId: string };

  return (
    <>
      {addItemProps && <AddItem {...addItemProps} catchError={catchError} />}
      <MuiList droppableProps={droppableProps} {...other}>
        {listItems &&
          listItems.map((listItem, index) => {
            const { itemId, ...other } = listItem;

            return (
              <ListItem
                draggableProps={
                  dnd && { draggableId: `${droppableId}:${itemId}`, index }
                }
                key={itemId}
                itemId={itemId}
                checkboxProps={checkboxProps}
                listItemTextProps={listItemTextProps}
                deleteButtonProps={deleteButtonProps}
                catchError={catchError}
                {...other}
              />
            );
          })}
      </MuiList>
    </>
  );
};

export default List;
