import React, { FunctionComponent } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Grid } from "@material-ui/core";
import { clientManager } from "../../apollo-client-manager";
import { ItemId } from "../../../types";
import { getRelationshipsForLeftItemAndRelation } from "../../../redux-reducers";
import { OneCard } from "./one-card";

export const SortCard: FunctionComponent<{
  currentPath: ItemId[];
  relationId: ItemId;
  mainId: string;
}> = ({ currentPath, relationId, mainId }) => {
  const droppableId1 = "drop1";
  const droppableId2 = "drop2";
  const {
    pathProps1,
    pathProps2,
  } = clientManager.reduxHooksManager.useTwoOneCards(currentPath);
  // const {} = clientManager.apolloHooksManager.useRelinkRelationships();

  return (
    <DragDropContext
      onDragEnd={(dropResult: DropResult): void => {
        const { source, destination } = dropResult;

        if (!destination) {
          return;
        }

        // if (destination.droppableId !== source.droppableId) {
        //   const { itemId: sId } =
        //     source.droppableId === droppableId1 ? pathProps1 : pathProps2;
        //   const { itemId: dId } =
        //     source.droppableId === droppableId1 ? pathProps2 : pathProps1;

        //   const relationships = clientManager.select(
        //     getRelationshipsForLeftItemAndRelation({
        //       relatedToId: sId,
        //       relationId,
        //     })
        //   );

        //   const relationship = relationships[source.index];

        //   if (relationship) {
        //     const {
        //       id,
        //       ids: [, , relatedId],
        //     } = relationship;
        //     update({
        //       id,
        //       ids: [dId, relationId, relatedId],
        //     });
        //   }
        // }
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <OneCard
            droppableId={droppableId1}
            pathProps={pathProps1}
            relationId={relationId}
            mainId={mainId}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <OneCard
            droppableId={droppableId2}
            pathProps={pathProps2}
            relationId={relationId}
            mainId={mainId}
          />
        </Grid>
      </Grid>
    </DragDropContext>
  );
};
