import React, { Fragment, FunctionComponent } from "react";
import { AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    height: theme.spacing(1.5),
    boxShadow: "none",
  },
}));

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
