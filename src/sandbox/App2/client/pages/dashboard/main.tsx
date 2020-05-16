import React, { FunctionComponent, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Items, ItemsCard } from "./items";
import { mainStyles } from "./dashboard.style";

const useStyles = makeStyles(mainStyles);

export const Main: FunctionComponent = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={open ? 6 : 12}>
            <Paper className={classes.paper}>
              <Items />
            </Paper>
          </Grid>
          {open && (
            <Grid item xs={12} md={6}>
              <ItemsCard close={(): void => setOpen(false)} />
            </Grid>
          )}
        </Grid>
      </Container>
    </main>
  );
};

export default Main;
