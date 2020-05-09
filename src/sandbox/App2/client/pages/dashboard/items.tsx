import React, { Fragment, FunctionComponent, SyntheticEvent } from "react";

import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

import { Title } from "../../components";

function preventDefault(event: SyntheticEvent): void {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export const Items: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Title>Items</Title>

      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more items
        </Link>
      </div>
    </Fragment>
  );
};

export default Items;
