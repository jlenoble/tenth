import React, { FunctionComponent } from "react";
import { ApolloError } from "apollo-client";
import { useMutation, useQuery } from "@apollo/react-hooks";

import { ListCard, CloseButton } from "../../../../../core";
import { ItemId } from "../../../types";
import { tmpId } from "../../tmp-id";
import { useMutateItems, updateOnCreateItem } from "./items";

import {
  GetRelatedItems,
  GetRelatedItemsQuery,
  GetRelatedItemsQueryVariables,
  CreateRelatedItem,
  CreateRelatedItemMutation,
  CreateRelatedItemMutationVariables,
} from "../../../__generated__";

export const useMutateRelatedItems = (
  relatedToId: ItemId,
  relationType: string
): {
  add: (input: string) => void;
} => {
  const [addItem] = useMutation<
    CreateRelatedItemMutation,
    CreateRelatedItemMutationVariables
  >(CreateRelatedItem, {
    update: (cache, { data }) => {
      const createRelatedItem = data?.createRelatedItem;

      if (createRelatedItem !== undefined) {
        const query = cache.readQuery<
          GetRelatedItemsQuery,
          GetRelatedItemsQueryVariables
        >({
          variables: { relatedToId, relationType },
          query: GetRelatedItems,
        });

        const relatedItems = query?.relatedItems;

        if (relatedItems) {
          cache.writeQuery<GetRelatedItemsQuery, GetRelatedItemsQueryVariables>(
            {
              variables: { relatedToId, relationType },
              query: GetRelatedItems,
              data: {
                relatedItems: {
                  ...relatedItems,
                  items: [
                    ...relatedItems.items,
                    { ...createRelatedItem, __typename: "Item" },
                  ],
                },
              },
            }
          );

          updateOnCreateItem(cache, {
            data: { createItem: { ...createRelatedItem, __typename: "Item" } },
          });
        }
      }
    },
  });

  const add = (input = ""): void => {
    addItem({
      variables: { relatedToId, relationType, title: input },
      optimisticResponse: {
        __typename: "Mutation",
        createRelatedItem: {
          __typename: "RelatedItem",
          id: tmpId(),
          title: input,
        },
      },
    });
  };

  return { add };
};

export const useRelatedItems = (
  relatedToId: ItemId,
  relationType: string
): {
  data?: GetRelatedItemsQuery;
  loading: boolean;
  error?: ApolloError;
  add: (input: string) => void;
  makeDestroy: (id: ItemId) => () => void;
} => {
  const { data, loading, error } = useQuery<
    GetRelatedItemsQuery,
    GetRelatedItemsQueryVariables
  >(GetRelatedItems, { variables: { relatedToId, relationType } });
  const { add } = useMutateRelatedItems(relatedToId, relationType);
  const { makeDestroy } = useMutateItems();

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

  const title = data?.relatedItems?.title || "RelatedItems";
  const items = data?.relatedItems?.items || [];

  return (
    <ListCard
      title={title}
      addItemProps={{ add }}
      listItems={items.map(({ id, title }) => {
        return {
          itemId: String(id),
          primary: title,
          // deleteButtonProps: {
          //   onClick: makeDestroy(id),
          // },
        };
      })}
      cardHeaderProps={{
        action: <CloseButton onClick={close} />,
      }}
    />
  );
};

export default RelatedItemsCard;
