import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar } from "./app-bar";
import { Drawer } from "./drawer";
import { Main } from "./main";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
}));

export const Dashboard: FunctionComponent = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = (): void => {
    setOpen(true);
  };
  const handleDrawerClose = (): void => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer open={open} handleDrawerClose={handleDrawerClose} />
      <Main />
    </div>
  );
};

export default Dashboard;
