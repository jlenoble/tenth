import React, { Fragment, FunctionComponent } from "react";
import { AppBar } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

export const appBarStyles = (
  theme: Theme
): { appBar: { height: number; boxShadow: string } } => ({
  appBar: {
    height: theme.spacing(1.5),
    boxShadow: "none",
  },
});

const useStyles = makeStyles(appBarStyles);

export const PageContainer: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar position="absolute" className={classes.appBar} />
      {children}
    </Fragment>
  );
};

export default PageContainer;
