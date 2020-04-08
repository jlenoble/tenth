import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  StatelessList,
  DefaultListProps,
  withDefaultListProps,
  withDefaultStatefulListProps,
  Props as BaseProps
} from "../ListFactory";
import { onDragEnd } from "./dnd";

export const withDnD = (List: StatelessList): StatelessList => {
  const WrappedList: StatelessList = ({ itemHooks, droppableId, ...other }) => (
    <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
      <List
        itemHooks={itemHooks}
        droppableId={droppableId || "drop-area"}
        {...other}
      />
    </DragDropContext>
  );

  WrappedList.displayName = "Sort" + (List.displayName || List.name || "List");

  return WrappedList;
};

export type Props = BaseProps;

export const makeListComponents = (
  List: StatelessList,
  defaultProps: DefaultListProps,
  prefix: string = ""
) => ({
  StatelessList: withDefaultListProps(withDnD(List), defaultProps, prefix),
  StatefulList: withDefaultStatefulListProps(
    withDnD(List),
    defaultProps,
    prefix
  )
});
