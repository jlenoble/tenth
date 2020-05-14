import React, { Fragment, FunctionComponent, SyntheticEvent } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

import { List } from "../../../../../core";
import { Title } from "../../components";

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

export const Items: FunctionComponent = () => {
  const classes = useStyles();

  const { data, loading, error } = useQuery(GET_ITEMS);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>ERROR</p>;

  return (
    <Fragment>
      <Title>Items</Title>
      <List
        addItemProps={{
          add: (input = ""): void => {
            console.log("add", input);
          },
        }}
        listItems={data.items.map(({ id, title }) => {
          return {
            key: id,
            primary: title,
            deleteButtonProps: {
              onClick: (): void => {
                console.log("delete", id);
              },
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
