import React, { FunctionComponent } from "react";

import { ListCard, CloseButton } from "../../../../../core";
import { ItemId } from "../../../types";
import { clientManager } from "../../apollo-client-manager";

export const OrderedItemsCard: FunctionComponent<{
  droppableId?: string;
  relatedToId: ItemId;
  relationId: ItemId;
  open?: (id: ItemId) => void;
  close?: () => void;
  viewKey?: string;
}> = ({ droppableId, relatedToId, relationId, open, close, viewKey }) => {
  const {
    data,
    loading,
    error,
    add,
    makeDestroy,
    makeUpdate,
  } = clientManager.apolloHooksManager.useOrderedItems(relatedToId, relationId);

  if (loading) return <ListCard title="" listItems={[]} />;

  if (error || !data) return <p>ERROR</p>;

  const title = data.itemWithOrderedItems?.item.title || "ItemWithOrderedItems";
  const items = data.itemWithOrderedItems?.items || [];

  return (
    <ListCard
      droppableId={droppableId}
      title={title}
      addItemProps={{ add }}
      listItems={items.map(({ id, title }) => {
        return {
          itemId: String(id),
          "data-view-key": viewKey,
          primary: title,
          primaryEnter: makeUpdate(id),
          deleteButtonProps: {
            onClick: makeDestroy(id),
          },
          expandButtonProps: open && {
            onClick: (): void => open(id),
          },
        };
      })}
      cardHeaderProps={
        close && {
          action: <CloseButton onClick={close} />,
        }
      }
    />
  );
};

export default OrderedItemsCard;
