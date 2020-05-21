import React, { FunctionComponent } from "react";

import { ListCard, CloseButton } from "../../../../../core";
import { ItemId } from "../../../types";
import { clientManager } from "../../apollo-client-manager";

export const RelatedItemsCard: FunctionComponent<{
  relatedToId: ItemId;
  close: () => void;
}> = ({ relatedToId, close }) => {
  const {
    data,
    loading,
    error,
    add,
    makeDestroy,
  } = clientManager.hooks.useRelatedItems(relatedToId, relationId);

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
