import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import { AddItem, AddItemProps } from "../AddItem";
import { List as MuiList, ListProps as MuiListProps } from "../../base";
import { ListItem } from "../ListItem";
import { Item, Props } from "../types";

export type BaseListProps = Props<{
  droppableId?: string;
}>;

export type InputListProps = AddItemProps & BaseListProps;
export type ListProps = InputListProps & MuiListProps;

export const BaseList: FunctionComponent<BaseListProps & MuiListProps> = ({
  itemHooks,
  droppableId,
  ui,
  ...other
}) => {
  const items: Item[] = itemHooks.items || [];
  const lastIndex = items.length - 1;
  const dnd = Boolean(droppableId);
  const droppableProps = (dnd && { droppableId }) as
    | false
    | { droppableId: string };

  return (
    <MuiList droppableProps={droppableProps} {...other}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          divider={index !== lastIndex}
          dnd={dnd}
          index={index}
          item={item}
          itemHooks={itemHooks}
          ui={ui}
        />
      ))}
    </MuiList>
  );
};

export const InputList: FunctionComponent<ListProps> = ({
  tmpId,
  itemHooks,
  ...other
}) => (
  <>
    <AddItem tmpId={tmpId} itemHooks={itemHooks} />
    <Paper>
      <BaseList itemHooks={itemHooks} {...other} />
    </Paper>
  </>
);

export const List: FunctionComponent<ListProps> = ({ tmpId, ui, ...other }) => {
  if (ui?.addItem) {
    return <InputList tmpId={tmpId} ui={ui} {...other} />;
  }

  return <BaseList ui={ui} {...other} />;
};

export default List;
