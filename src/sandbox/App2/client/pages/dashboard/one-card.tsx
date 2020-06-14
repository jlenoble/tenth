import React, { FunctionComponent } from "react";
import { Grid } from "@material-ui/core";
import { Breadcrumbs } from "./breadcrumbs";
import { RelatedItemsCard } from "./related-items";
import { clientManager } from "../../apollo-client-manager";
import { ItemId } from "../../../types";

export const OneCard: FunctionComponent<{
  path: ItemId[];
  relationId: ItemId;
  mainId: string;
}> = ({ path, relationId, mainId }) => {
  const {
    currentPath,
    itemId,
    close,
    open,
    moveBack,
  } = clientManager.reduxHooksManager.useOneCard(path);

  // Counteract ListItem memoization to not leave UI in an inconsistent state
  // when currentPath is changed.
  const viewKey = currentPath.join(":");

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs
          currentPath={currentPath}
          moveBack={moveBack}
          mainId={mainId}
        />
      </Grid>
      <Grid item xs={12}>
        <RelatedItemsCard
          viewKey={viewKey}
          relatedToId={itemId}
          relationId={relationId}
          open={open}
          close={(currentPath.length > 1 && close) || undefined}
        />
      </Grid>
    </Grid>
  );
};

export const TwoOneCards: FunctionComponent<{
  currentPath: ItemId[];
  relationId: ItemId;
  mainId: string;
}> = ({ currentPath, relationId, mainId }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <OneCard path={currentPath} relationId={relationId} mainId={mainId} />
      </Grid>
      <Grid item xs={12} md={6}>
        <OneCard path={currentPath} relationId={relationId} mainId={mainId} />
      </Grid>
    </Grid>
  );
};
