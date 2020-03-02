import React, { FunctionComponent } from "react";
import Paper from "@material-ui/core/Paper";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { List, ListProps } from "../../core/list";

export interface ListViewProps extends ListProps {
  paperStyle?: CSSProperties;
}

export const ListView: FunctionComponent<ListViewProps> = ({
  paperStyle,
  ...other
}) => (
  <Paper style={paperStyle}>
    <List {...other} />
  </Paper>
);
