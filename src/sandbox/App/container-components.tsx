import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  List as CoreList,
  ListCard as CoreListCard,
  ListItemTextProps
} from "../../core";
import { ContainerComponentProps } from "./view-manager";

export const List = ({
  views,
  create,
  close,
  update
}: ContainerComponentProps<ListItemTextProps>) => {
  return (
    <DragDropContext onDragEnd={(dropResult: DropResult) => {}}>
      <CoreList
        droppableId="drop-area"
        addItemProps={{
          add: (input: string = "") => create({ primary: input })
        }}
        listItems={Array.from(views.entries()).map(([itemId, payload]) => {
          return {
            itemId,
            ...payload,
            primaryEnter: (value: string) => update(itemId, { primary: value }),
            deleteButtonProps: {
              onClick: () => close(itemId)
            }
          };
        })}
      />
    </DragDropContext>
  );
};

export const ListCard = ({
  views,
  create,
  close,
  update
}: ContainerComponentProps<ListItemTextProps>) => {
  return (
    <DragDropContext onDragEnd={(dropResult: DropResult) => {}}>
      <CoreListCard
        droppableId="drop-area"
        title={"ITEMS"}
        addItemProps={{
          add: (input: string = "") => create({ primary: input })
        }}
        listItems={Array.from(views.entries()).map(([itemId, payload]) => {
          return {
            itemId,
            ...payload,
            primaryEnter: (value: string) => update(itemId, { primary: value }),
            deleteButtonProps: {
              onClick: () => close(itemId)
            }
          };
        })}
      />
    </DragDropContext>
  );
};
