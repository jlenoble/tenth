import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import { AddItem, AddItemProps } from "../AddItem";
import { List, Props as ListProps } from "./List";

export interface InputListProps extends AddItemProps, ListProps {}

export const InputList: FunctionComponent<InputListProps> = ({
  tmpId,
  itemHooks,
  ...other
}) => (
  <>
    <AddItem tmpId={tmpId} itemHooks={itemHooks} />
    <Paper>
      <List itemHooks={itemHooks} {...other} />
    </Paper>
  </>
);
