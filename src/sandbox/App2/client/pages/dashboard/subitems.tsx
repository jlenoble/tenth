import React, { FunctionComponent } from "react";
import { ApolloError } from "apollo-client";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { ListCard, CloseButton } from "../../../../../core";
import { GQLItem, ItemId } from "../../../types";
import { tmpId } from "../../tmp-id";
import { useMutateItems } from "./items";

const GET_SUBITEMS = gql`
  query GetSubItems($itemId1: Int!) {
    subItems(itemId1: $itemId1) {
      id
      title
      items
    }
  }
`;

const CREATE_SUBITEM = gql`
  mutation CreateSubItem($itemId1: Int!, $title: String!) {
    createSubItem(itemId1: $itemId1, title: $title) {
      id
      title
    }
  }
`;

export const useMutateSubItems = (): {
  add: () => void;
} => {
  const [addItem] = useMutation(CREATE_SUBITEM, {
    update: (cache, { data: { createSubItem } }) => {
      const data = cache.readQuery<{
        id: ItemId;
        title: string;
        items: GQLItem[];
      }>({
        query: GET_SUBITEMS,
      });

      if (data) {
        cache.writeQuery<{ id: ItemId; title: string; items: GQLItem[] }>({
          query: GET_SUBITEMS,
          data: { ...data, items: [...data.items, createSubItem] },
        });
      }
    },
  });

  const add = (input = ""): void => {
    addItem({
      variables: { title: input },
      optimisticResponse: {
        __typename: "Mutation",
        createItem: {
          __typename: "Item",
          id: tmpId(),
          title: input,
        },
      },
    });
  };

  return { add };
};

export const useSubItems = (): {
  data: { items: GQLItem[] };
  loading: boolean;
  error?: ApolloError;
  add: () => void;
  makeDestroy: (id: ItemId) => () => void;
} => {
  const { add } = useMutateSubItems();
  const { makeDestroy } = useMutateItems();

  return {
    data: { items: [] },
    loading: false,
    error: undefined,
    add,
    makeDestroy,
  };
};

export const SubItemsCard: FunctionComponent<{ close: () => void }> = ({
  close,
}) => {
  const { data, loading, error, add, makeDestroy } = useSubItems();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>ERROR</p>;

  return (
    <ListCard
      title="SubItems"
      addItemProps={{ add }}
      listItems={data.items.map(({ id, title }: GQLItem) => {
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

export default SubItemsCard;
