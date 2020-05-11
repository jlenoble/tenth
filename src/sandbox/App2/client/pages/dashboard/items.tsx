import React, { Fragment, FunctionComponent, SyntheticEvent } from "react";

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

const items: [number, { primary: string }][] = [
  [0, { primary: "toto" }],
  [1, { primary: "totoui" }],
];

export const Items: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Title>Items</Title>
      <List
        // droppableId="drop-area"
        addItemProps={{
          add: (input = ""): void => {
            console.log("add", input);
          },
        }}
        listItems={items.map(([id, payload]) => {
          return {
            key: id,
            ...payload,
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
