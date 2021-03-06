import React, { FunctionComponent } from "react";
import { Grid } from "@material-ui/core";
import { Breadcrumbs } from "./breadcrumbs";
import { RelatedItemsCard } from "./related-items";
import { clientManager } from "../../apollo-client-manager";
import { ItemId } from "../../../types";

export const TwoCards: FunctionComponent<{
  relationId: ItemId;
  mainId: string;
}> = ({ relationId, mainId }) => {
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
  } = clientManager.reduxHooksManager.useTwoCards();

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
      <Grid item xs={12} md={rightOpened ? 6 : 12}>
        <RelatedItemsCard
          viewKey={viewKey}
          relatedToId={leftItemId}
          relationId={relationId}
          open={openRight}
          close={(currentPath.length > 1 && closeLeft) || undefined}
        />
      </Grid>
      {rightOpened && (
        <Grid item xs={12} md={6}>
          <RelatedItemsCard
            viewKey={viewKey}
            relatedToId={rightItemId}
            relationId={relationId}
            open={openRightRight}
            close={closeRight}
          />
        </Grid>
      )}
    </Grid>
  );
};
