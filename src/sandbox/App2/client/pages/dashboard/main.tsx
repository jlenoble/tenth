import React, { FunctionComponent, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";

import { ItemId } from "../../../types";
// import { clientManager } from "../../apollo-client-manager";
import { RelatedItemsCard } from "./related-items";
import { mainStyles } from "./dashboard.style";

const useStyles = makeStyles(mainStyles);

export const Main: FunctionComponent = () => {
  const classes = useStyles();
  const [openedItemId, setOpenedItemId] = useState<ItemId>(0);
  // clientManager.hooks.useItems();

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={openedItemId > 0 ? 6 : 12}>
            <RelatedItemsCard relatedToId={1} open={setOpenedItemId} />
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
