import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  List as CoreList,
  ListCard as CoreListCard,
  ListItemProps
} from "../../../core";
import { VisibilityFilter } from "../types";
import { ContainerComponentProps } from "./view-manager";
import { Menu } from "./menu";

export const List = ({
  views,
  create,
  close,
  update
}: ContainerComponentProps<Omit<ListItemProps, "itemId">>) => {
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
  update,
  visibilityFilter,
  setVisibilityFilter
}: ContainerComponentProps<Omit<ListItemProps, "itemId">>) => {
  switch (visibilityFilter) {
    case VisibilityFilter.SHOW_ACTIVE: {
      views = new Map(Array.from(views).filter(([_, { checked }]) => !checked));
      break;
    }

    case VisibilityFilter.SHOW_COMPLETED: {
      views = new Map(Array.from(views).filter(([_, { checked }]) => checked));
      break;
    }

    case VisibilityFilter.SHOW_INVALID: {
      views = new Map(
        Array.from(views).filter(([_, { errors }]) => errors?.length)
      );
      break;
    }
  }

  return (
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
          checkboxProps: {
            onClick: () =>
              update(itemId, { ...payload, checked: !payload.checked })
          },
          primaryEnter: (value: string) =>
            update(itemId, { ...payload, primary: value }),
          deleteButtonProps: {
            onClick: () => close(itemId)
          },
          expandButtonProps: {
            onClick: () => console.log("expand", itemId)
          }
        };
      })}
      cardHeaderProps={{
        action: (
          <Menu
            visibilityFilter={visibilityFilter}
            setVisibilityFilter={setVisibilityFilter}
          />
        )
      }}
    />
  );
};
