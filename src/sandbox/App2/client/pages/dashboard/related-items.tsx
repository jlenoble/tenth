import React, { FunctionComponent } from "react";
import { ApolloError } from "apollo-client";
import { useMutation, useQuery } from "@apollo/react-hooks";

import { ListCard, CloseButton } from "../../../../../core";
import { ItemId } from "../../../types";
import { tmpId } from "../../tmp-id";
import { useMutateItems, updateOnCreateItem } from "./items";

import {
  GetItems,
  GetItemsQuery,
  GetItemsQueryVariables,
  GetItemWithRelatedItems,
  GetItemWithRelatedItemsQuery,
  GetItemWithRelatedItemsQueryVariables,
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
          GetItemWithRelatedItemsQuery,
          GetItemWithRelatedItemsQueryVariables
        >({
          variables: { relatedToId, relationType },
          query: GetItemWithRelatedItems,
        });

        const itemWithRelatedItems = query?.itemWithRelatedItems;

        if (itemWithRelatedItems) {
          cache.writeQuery<
            GetItemWithRelatedItemsQuery,
            GetItemWithRelatedItemsQueryVariables
          >({
            variables: { relatedToId, relationType },
            query: GetItemWithRelatedItems,
            data: {
              itemWithRelatedItems: {
                ...itemWithRelatedItems,
                items: [...itemWithRelatedItems.items, createRelatedItem],
              },
            },
          });

          updateOnCreateItem(cache, {
            data: { createItem: createRelatedItem },
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
          __typename: "Item",
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
  data?: GetItemWithRelatedItemsQuery;
  loading: boolean;
  error?: ApolloError;
  add: (input: string) => void;
  makeDestroy: (id: ItemId) => () => void;
} => {
  useQuery<GetItemsQuery, GetItemsQueryVariables>(GetItems);

  const { data, loading, error } = useQuery<
    GetItemWithRelatedItemsQuery,
    GetItemWithRelatedItemsQueryVariables
  >(GetItemWithRelatedItems, { variables: { relatedToId, relationType } });

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
