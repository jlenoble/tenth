import React, { Fragment, FunctionComponent, SyntheticEvent } from "react";

import { Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListCard,
  CloseButton,
  useErrorFeedback,
} from "../../../../../core";
import { Title } from "../../components";
import { ItemId } from "../../../types";
import { clientManager } from "../../apollo-client-manager";

function preventDefault(event: SyntheticEvent): void {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(2),
  },
}));

export const Items: FunctionComponent<{ open: (id: ItemId) => void }> = ({
  open,
}) => {
  const classes = useStyles();
  const {
    data,
    loading,
    error,
    add,
    makeDestroy,
  } = clientManager.hooks.useItems();
  const { ErrorFeedback, catchError } = useErrorFeedback();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>ERROR</p>;

  return (
    <Fragment>
      <Title>Items</Title>
      {ErrorFeedback && <ErrorFeedback />}
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
        catchError={catchError}
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
  const {
    data,
    loading,
    error,
    add,
    makeDestroy,
  } = clientManager.hooks.useItems();

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
