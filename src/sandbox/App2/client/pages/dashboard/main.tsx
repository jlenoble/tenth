import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";

import { ItemId } from "../../../types";
import {
  deepenCurrentPath,
  moveBackCurrentPath,
  setCurrentPath,
  setCurrentPathToSiblingPath,
  getCurrentPath,
} from "../../../redux-reducers";
import { Breadcrumbs } from "./breadcrumbs";
import { RelatedItemsCard } from "./related-items";
import { mainStyles } from "./dashboard.style";

const useStyles = makeStyles(mainStyles);

const TwoCards: FunctionComponent<{
  leftCard?: { relatedToId: ItemId };
  rightCard?: { relatedToId: ItemId };
}> = ({ leftCard, rightCard }) => {
  const currentPath = useSelector(getCurrentPath);
  const dispatch = useDispatch();
  const [[leftItemId, rightItemId], setIds] = useState<[ItemId, ItemId]>([
    leftCard?.relatedToId || currentPath[currentPath.length - 1] || 1,
    rightCard?.relatedToId || 0,
  ]);

  const openRight = (id: ItemId) => {
    setIds([leftItemId, id]);
    if (rightItemId > 0) {
      dispatch(setCurrentPathToSiblingPath(id));
    } else {
      dispatch(deepenCurrentPath(id));
    }
  };

  const closeRight = () => {
    setIds([leftItemId, 0]);
    dispatch(moveBackCurrentPath());
  };

  const openSubItem = (id: ItemId) => {
    setIds([rightItemId, id]);
    dispatch(deepenCurrentPath(id));
  };

  const moveBack = (currentPath: ItemId[], index: number) => () => {
    const newPath = currentPath.concat();

    if (rightItemId > 0) {
      if (index > 0) {
        setIds([currentPath[index - 1], currentPath[index]]);
      } else {
        setIds([currentPath[0], 0]);
      }
    } else {
      setIds([currentPath[index], 0]);
    }

    newPath.splice(index + 1);
    dispatch(setCurrentPath(newPath));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs moveBack={moveBack} />
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
