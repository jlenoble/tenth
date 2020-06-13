import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

import { mainStyles } from "./dashboard.style";
import { TwoCards } from "./two-cards";
import { clientManager } from "../../apollo-client-manager";

const useStyles = makeStyles(mainStyles);

export enum MainId {
  items = "items",
  categories = "categories",
}

const getRelation = (mainId: MainId): string => {
  switch (mainId) {
    case MainId.categories: {
      return "→";
    }

    case MainId.items:
    default:
      return "⊃";
  }
};

export const Main: FunctionComponent<{ mainId?: MainId }> = ({
  mainId = MainId.items,
}) => {
  const classes = useStyles();

  const {
    relationId,
    loading,
    error,
  } = clientManager.apolloHooksManager.useRelation(getRelation(mainId));

  if (loading) return <span />;
  if (error || !relationId) return <p>ERROR</p>;

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <TwoCards relationId={relationId} mainId={mainId} />
      </Container>
    </main>
  );
};

export default Main;
