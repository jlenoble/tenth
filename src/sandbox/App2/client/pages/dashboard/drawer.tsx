import React, { FunctionComponent } from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer as MuiDrawer,
  List,
  Divider,
  IconButton,
} from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";

import { drawerStyles } from "./dashboard.style";
import { mainListItems, secondaryListItems } from "./list-items";

const useStyles = makeStyles(drawerStyles);

export const Drawer: FunctionComponent<{
  open: boolean;
  handleDrawerClose: () => void;
}> = ({ open, handleDrawerClose }) => {
  const classes = useStyles();

  return (
    <MuiDrawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />
      <List>{mainListItems}</List>
      <Divider />
      <List>{secondaryListItems}</List>
    </MuiDrawer>
  );
};

export default FunctionComponent;
