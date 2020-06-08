import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar } from "./app-bar";
import { Drawer } from "./drawer";
import { Main, MainId } from "./main";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
}));

export const Dashboard: FunctionComponent<
  RouteComponentProps & { mainId?: MainId }
> = ({ mainId }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
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
      <Main mainId={mainId} />
    </div>
  );
};

export default Dashboard;
