import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import { AddItem, AddItemProps } from "../AddItem";
import { BaseList, Props as BaseListProps } from "./BaseList";

export interface Props extends AddItemProps, BaseListProps {}

export const InputList: FunctionComponent<Props> = ({
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
