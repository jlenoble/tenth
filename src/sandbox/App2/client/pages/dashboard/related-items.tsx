import React, { FunctionComponent } from "react";

import { ListCard, CloseButton } from "../../../../../core";
import { ItemId } from "../../../types";
import { clientManager } from "../../apollo-client-manager";

export const RelatedItemsCard: FunctionComponent<{
  relatedToId: ItemId;
  open?: (id: ItemId) => void;
  close?: () => void;
  viewKey?: string;
}> = ({ relatedToId, open, close, viewKey }) => {
  const {
    data,
    loading,
    error,
    add,
    makeDestroy,
  } = clientManager.hooksManager.useRelatedItems(relatedToId, 2);

  if (loading) return <ListCard title="" listItems={[]} />;

  if (error || !data) return <p>ERROR</p>;

  const title = data.itemWithRelatedItems?.item.title || "ItemWithRelatedItems";
  const items = data.itemWithRelatedItems?.items || [];

  return (
    <ListCard
      title={title}
      addItemProps={{ add }}
      listItems={items.map(({ id, title }) => {
        return {
          itemId: String(id),
          "data-view-key": viewKey,
          primary: title,
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

export default RelatedItemsCard;
