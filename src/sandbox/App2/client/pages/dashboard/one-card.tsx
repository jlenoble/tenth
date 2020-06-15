import React, { FunctionComponent } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Grid } from "@material-ui/core";
import { Breadcrumbs } from "./breadcrumbs";
import { RelatedItemsCard } from "./related-items";
import { clientManager } from "../../apollo-client-manager";
import { ItemId } from "../../../types";

export const OneCard: FunctionComponent<{
  droppableId?: string;
  path: ItemId[];
  relationId: ItemId;
  mainId: string;
}> = ({ droppableId, path, relationId, mainId }) => {
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
          droppableId={droppableId}
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
    <DragDropContext
      onDragEnd={(dropResult: DropResult) => {
        console.log(dropResult);
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <OneCard
            droppableId={"drop1"}
            path={currentPath}
            relationId={relationId}
            mainId={mainId}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <OneCard
            droppableId={"drop2"}
            path={currentPath}
            relationId={relationId}
            mainId={mainId}
          />
        </Grid>
      </Grid>
    </DragDropContext>
  );
};
