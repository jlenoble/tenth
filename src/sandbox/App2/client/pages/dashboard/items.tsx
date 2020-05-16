import React, { Fragment, FunctionComponent, SyntheticEvent } from "react";
import { ApolloError } from "apollo-client";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

import { List } from "../../../../../core";
import { Title } from "../../components";
import { GQLItem, ItemId } from "../../../types";
import { tmpId } from "../../tmp-id";

function preventDefault(event: SyntheticEvent): void {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(2),
  },
}));

const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      title
    }
  }
`;

const CREATE_ITEM = gql`
  mutation CreateItem($title: String!) {
    createItem(title: $title) {
      id
      title
    }
  }
`;

const DESTROY_ITEM = gql`
  mutation DestroyItem($id: Int!) {
    destroyItem(id: $id) {
      id
    }
  }
`;

export const useItems = (): {
  data: { items: GQLItem[] };
  loading: boolean;
  error?: ApolloError;
  add: () => void;
  makeDestroy: (id: ItemId) => () => void;
} => {
  const { data, loading, error } = useQuery(GET_ITEMS);

  const [addItem] = useMutation(CREATE_ITEM, {
    update: (cache, { data: { createItem } }) => {
      const data = cache.readQuery<{ items: GQLItem[] }>({ query: GET_ITEMS });

      if (data) {
        cache.writeQuery({
          query: GET_ITEMS,
          data: { items: [...data.items, createItem] },
        });
      }
    },
  });

  const [destroyItem] = useMutation(DESTROY_ITEM, {
    update: (
      cache,
      {
        data: {
          destroyItem: { id },
        },
      }
    ) => {
      const data = cache.readQuery<{ items: GQLItem[] }>({ query: GET_ITEMS });

      if (data) {
        let items = data.items;
        const index = items.findIndex((item) => item.id === id);

        if (index !== -1) {
          items = [...items.slice(0, index), ...items.slice(index + 1)];
          cache.writeQuery({ query: GET_ITEMS, data: { items } });
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

  return { data, loading, error, add, makeDestroy };
};

export const Items: FunctionComponent = () => {
  const classes = useStyles();
  const { data, loading, error, add, makeDestroy } = useItems();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>ERROR</p>;

  return (
    <Fragment>
      <Title>Items</Title>
      <List
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
      />
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more items
        </Link>
      </div>
    </Fragment>
  );
};

export default Items;
