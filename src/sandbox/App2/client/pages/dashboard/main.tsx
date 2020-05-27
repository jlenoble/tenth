import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";

import { ItemId } from "../../../types";
import {
  deepenCurrentPath,
  moveBackCurrentPath,
} from "../../../redux-reducers";
import { Breadcrumbs } from "./breadcrumbs";
import { RelatedItemsCard } from "./related-items";
import { mainStyles } from "./dashboard.style";

const useStyles = makeStyles(mainStyles);

const TwoCards: FunctionComponent<{
  leftCard?: { relatedToId: ItemId };
  rightCard?: { relatedToId: ItemId };
}> = ({ leftCard, rightCard }) => {
  const [[leftItemId, rightItemId], setIds] = useState<[ItemId, ItemId]>([
    leftCard?.relatedToId || 1,
    rightCard?.relatedToId || 0,
  ]);
  const dispatch = useDispatch();

  const openRight = (id: ItemId) => {
    setIds([leftItemId, id]);
    dispatch(deepenCurrentPath(id));
  };

  const closeRight = () => {
    setIds([leftItemId, 0]);
    dispatch(moveBackCurrentPath());
  };

  const openSubItem = (id: ItemId) => {
    setIds([rightItemId, id]);
    dispatch(deepenCurrentPath(id));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs moveBack={setIds} childOpened={rightItemId > 0} />
      </Grid>
      <Grid item xs={12} md={rightItemId > 0 ? 6 : 12}>
        <RelatedItemsCard relatedToId={leftItemId} open={openRight} />
      </Grid>
      {rightItemId > 0 && (
        <Grid item xs={12} md={6}>
          <RelatedItemsCard
            relatedToId={rightItemId}
            open={openSubItem}
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
