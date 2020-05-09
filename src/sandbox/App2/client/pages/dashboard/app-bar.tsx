import React, { FunctionComponent } from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
} from "@material-ui/core";
import { Menu, Notifications } from "@material-ui/icons";

import { appBarStyles } from "./dashboard.style";

const useStyles = makeStyles(appBarStyles);

export const AppBar: FunctionComponent<{
  open: boolean;
  handleDrawerOpen: () => void;
}> = ({ open, handleDrawerOpen }) => {
  const classes = useStyles();

  return (
    <MuiAppBar
      position="absolute"
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <Menu />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Dashboard
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <Notifications />
          </Badge>
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
