import React, { FunctionComponent, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { ItemId } from "../../../types";
import { Items } from "./items";
import { RelatedItemsCard } from "./related-items";
import { mainStyles } from "./dashboard.style";

const useStyles = makeStyles(mainStyles);

export const Main: FunctionComponent = () => {
  const classes = useStyles();
  const [openedItemId, setOpenedItemId] = useState<ItemId>(0);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={openedItemId > 0 ? 6 : 12}>
            <Paper className={classes.paper}>
              <Items open={setOpenedItemId} />
            </Paper>
          </Grid>
          {openedItemId > 0 && (
            <Grid item xs={12} md={6}>
              <RelatedItemsCard
                relatedToId={openedItemId}
                close={(): void => setOpenedItemId(0)}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </main>
  );
};

export default Main;
