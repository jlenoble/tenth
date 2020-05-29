import React, { FunctionComponent } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";

import { Breadcrumbs } from "./breadcrumbs";
import { RelatedItemsCard } from "./related-items";
import { mainStyles } from "./dashboard.style";
import { clientManager } from "../../apollo-client-manager";

const useStyles = makeStyles(mainStyles);

const TwoCards: FunctionComponent = () => {
  const {
    currentPath,
    leftItemId,
    rightItemId,
    rightOpened,
    closeLeft,
    openRight,
    closeRight,
    openRightRight,
    moveBack,
  } = clientManager.hooks.useTwoCards();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs moveBack={moveBack} />
      </Grid>
      <Grid item xs={12} md={rightOpened ? 6 : 12}>
        <RelatedItemsCard
          relatedToId={leftItemId}
          open={openRight}
          close={(currentPath.length > 1 && closeLeft) || undefined}
        />
      </Grid>
      {rightOpened && (
        <Grid item xs={12} md={6}>
          <RelatedItemsCard
            relatedToId={rightItemId}
            open={openRightRight}
            close={closeRight}
          />
        </Grid>
      )}
    </Grid>
  );
};

export const Main: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <TwoCards />
      </Container>
    </main>
  );
};

export default Main;
