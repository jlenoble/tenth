import React, { FunctionComponent } from "react";
import { useNavigate } from "@reach/router";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@material-ui/core";
import { ChevronLeft, Dashboard, Category } from "@material-ui/icons";

import { drawerStyles } from "./dashboard.style";

const useStyles = makeStyles(drawerStyles);

const icons = {
  items: Dashboard,
  categories: Category,
};

export const Drawer: FunctionComponent<{
  open: boolean;
  handleDrawerClose: () => void;
}> = ({ open, handleDrawerClose }) => {
  const classes = useStyles();
  const navigate = useNavigate();

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
      <List>
        {Object.entries(icons).map(([key, IconComponent]) => {
          const path = "/" + key;
          console.log(path, location.pathname, path === location.pathname);

          return (
            <ListItem
              key={key}
              button
              onClick={() => {
                navigate(path);
              }}
              className={
                path === location.pathname
                  ? classes.activeDrawerItem
                  : undefined
              }
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText primary={key[0].toUpperCase() + key.slice(1)} />
            </ListItem>
          );
        })}
      </List>
    </MuiDrawer>
  );
};

export default FunctionComponent;
