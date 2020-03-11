import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  StatelessList,
  DefaultListProps,
  withDefaultStatefulListProps,
  Props as BaseProps
} from "../ListFactory";
import { onDragEnd } from "./dnd";

const withDnD = (List: StatelessList): StatelessList => {
  const WrappedList: StatelessList = ({ itemHooks = {}, ...other }) => (
    <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
      <List itemHooks={itemHooks} droppableId={"list0"} {...other} />
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
  SortList: withDefaultStatefulListProps(withDnD(List), defaultProps, prefix)
});
