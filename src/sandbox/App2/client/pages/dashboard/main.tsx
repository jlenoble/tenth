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

const TwoCards: FunctionComponent = () => {
  const currentPath = useSelector(getCurrentPath);
  const dispatch = useDispatch();
  const [rightOpened, setRightOpened] = useState(false);

  const [leftItemId, rightItemId] =
    currentPath.length === 1
      ? [currentPath[0], 0]
      : rightOpened
      ? [
          currentPath[currentPath.length - 2],
          currentPath[currentPath.length - 1],
        ]
      : [currentPath[currentPath.length - 1], 0];

  const closeLeft = () => {
    if (rightOpened) {
      setRightOpened(false);
    } else {
      dispatch(moveBackCurrentPath());
    }
  };

  const openRight = (id: ItemId) => {
    if (rightOpened) {
      dispatch(setCurrentPathToSiblingPath(id));
    } else {
      setRightOpened(true);
      dispatch(deepenCurrentPath(id));
    }
  };

  const closeRight = () => {
    setRightOpened(false);
    dispatch(moveBackCurrentPath());
  };

  const openRightRight = (id: ItemId) => {
    dispatch(deepenCurrentPath(id));
  };

  const moveBack = (index: number) => () => {
    if (index === 0) {
      setRightOpened(false);
    }
    dispatch(setCurrentPath(currentPath.slice(0, index + 1)));
  };

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
