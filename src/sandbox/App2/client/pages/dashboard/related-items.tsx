import React, { FunctionComponent } from "react";

import { ListCard, CloseButton } from "../../../../../core";
import { ItemId } from "../../../types";
import { hooksManager } from "./items";

export const RelatedItemsCard: FunctionComponent<{
  relatedToId: ItemId;
  relationType: string;
  close: () => void;
}> = ({ relatedToId, relationType, close }) => {
  const {
    data,
    loading,
    error,
    add,
    makeDestroy,
  } = hooksManager.useRelatedItems(relatedToId, relationType);

  if (loading) return <p>Loading...</p>;
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
          primary: title,
          deleteButtonProps: {
            onClick: makeDestroy(id),
          },
        };
      })}
      cardHeaderProps={{
        action: <CloseButton onClick={close} />,
      }}
    />
  );
};

export default RelatedItemsCard;
