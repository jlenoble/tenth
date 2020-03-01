import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { List, ListProps } from "./List";

export interface DisplayListProps extends ListProps {
  paperStyle?: CSSProperties;
}

export const DisplayList: FunctionComponent<DisplayListProps> = ({
  paperStyle,
  ...other
}) => (
  <Paper style={paperStyle}>
    <List {...other} />
  </Paper>
);
