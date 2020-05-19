import React, { FunctionComponent } from "react";
import { ApolloError } from "apollo-client";
import { useQuery } from "@apollo/react-hooks";

import { ListCard, CloseButton } from "../../../../../core";
import { ItemId, Variables, Data } from "../../../types";
import { hooksManager } from "./items";
import { nodes } from "../../graphql-nodes";

export const useRelatedItems = (
  relatedToId: ItemId,
  relationType: string
): {
  data?: Data["itemWithRelatedItems"];
  loading: boolean;
  error?: ApolloError;
  add: (input: string) => void;
  makeDestroy: (id: ItemId) => () => void;
} => {
  useQuery<Data["items"], Variables["items"]>(nodes["items"]);

  const { data, loading, error } = useQuery<
    Data["itemWithRelatedItems"],
    Variables["itemWithRelatedItems"]
  >(nodes["itemWithRelatedItems"], {
    variables: { relatedToId, relationType },
  });

  const add = hooksManager.useAddRelatedItem(relatedToId, relationType);
  const makeDestroy = hooksManager.useMakeDestroyItem();

  return {
    data,
    loading,
    error,
    add,
    makeDestroy,
  };
};

export const RelatedItemsCard: FunctionComponent<{
  relatedToId: ItemId;
  relationType: string;
  close: () => void;
}> = ({ relatedToId, relationType, close }) => {
  const { data, loading, error, add, makeDestroy } = useRelatedItems(
    relatedToId,
    relationType
  );

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>ERROR</p>;

  const title =
    data?.itemWithRelatedItems?.item.title || "ItemWithRelatedItems";
  const items = data?.itemWithRelatedItems?.items || [];

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
