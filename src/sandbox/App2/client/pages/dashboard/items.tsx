import React, { Fragment, FunctionComponent, SyntheticEvent } from "react";
import { ApolloError } from "apollo-client";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { List, ListCard, CloseButton } from "../../../../../core";
import { Title } from "../../components";
import {
  ItemId,
  CreateItemMutation,
  CreateItemMutationVariables,
} from "../../../types";
import { tmpId } from "../../tmp-id";
import {
  CreateItem,
  DestroyItem,
  GetItems,
  GetItemsQuery,
  GetItemsQueryVariables,
  DestroyItemMutation,
  DestroyItemMutationVariables,
} from "../../../__generated__";

function preventDefault(event: SyntheticEvent): void {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(2),
  },
}));

export const useMutateItems = (): {
  add: (input: string) => void;
  makeDestroy: (id: ItemId) => () => void;
} => {
  const [addItem] = useMutation<
    CreateItemMutation,
    CreateItemMutationVariables
  >(CreateItem, {
    update: (cache, { data }) => {
      const createItem = data?.createItem;

      if (createItem !== undefined) {
        const query = cache.readQuery<GetItemsQuery, GetItemsQueryVariables>({
          query: GetItems,
        });

        if (query !== null) {
          cache.writeQuery<GetItemsQuery, GetItemsQueryVariables>({
            query: GetItems,
            data: { items: [...query.items, createItem] },
          });
        }
      }
    },
  });

  const [destroyItem] = useMutation<
    DestroyItemMutation,
    DestroyItemMutationVariables
  >(DestroyItem, {
    update: (cache, { data }) => {
      const id = data?.destroyItem?.id;

      if (id !== undefined) {
        const query = cache.readQuery<GetItemsQuery, GetItemsQueryVariables>({
          query: GetItems,
        });

        if (query !== null) {
          let items = query.items;
          const index = items.findIndex((item) => item?.id === id);

          if (index !== -1) {
            items = [...items.slice(0, index), ...items.slice(index + 1)];
            cache.writeQuery<GetItemsQuery, GetItemsQueryVariables>({
              query: GetItems,
              data: { items },
            });
          }
        }
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

  const makeDestroy = (id: ItemId) => (): void => {
    destroyItem({
      variables: { id },
      optimisticResponse: {
        __typename: "Mutation",
        destroyItem: {
          __typename: "Item",
          id,
        },
      },
    });
  };

  return { add, makeDestroy };
};

export const useItems = (): {
  data?: GetItemsQuery;
  loading: boolean;
  error?: ApolloError;
  add: (input: string) => void;
  makeDestroy: (id: ItemId) => () => void;
} => {
  return {
    ...useQuery<GetItemsQuery, GetItemsQueryVariables>(GetItems),
    ...useMutateItems(),
  };
};

export const Items: FunctionComponent<{ open: (id: ItemId) => void }> = ({
  open,
}) => {
  const classes = useStyles();
  const { data, loading, error, add, makeDestroy } = useItems();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>ERROR</p>;

  return (
    <Fragment>
      <Title>Items</Title>
      <List
        addItemProps={{ add }}
        listItems={data.items.map(({ id, title }) => {
          return {
            itemId: String(id),
            primary: title,
            deleteButtonProps: {
              onClick: makeDestroy(id),
            },
            expandButtonProps: {
              onClick: (): void => open(id),
            },
          };
        })}
      />
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more items
        </Link>
      </div>
    </Fragment>
  );
};

export const ItemsCard: FunctionComponent<{ close: () => void }> = ({
  close,
}) => {
  const { data, loading, error, add, makeDestroy } = useItems();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>ERROR</p>;

  return (
    <ListCard
      title="Items"
      addItemProps={{ add }}
      listItems={data.items.map(({ id, title }) => {
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

export default Items;
