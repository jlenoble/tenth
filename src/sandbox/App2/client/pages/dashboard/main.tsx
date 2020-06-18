import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

import { mainStyles } from "./dashboard.style";
import { TwoCards } from "./two-cards";
import { clientManager } from "../../apollo-client-manager";
import { TwoOneCards } from "./one-card";
import { TwoSortCards } from "./sort-card";
import { getCurrentPath } from "../../../redux-reducers";

const useStyles = makeStyles(mainStyles);

export enum MainId {
  items = "items",
  categories = "categories",
  priorities = "priorities",
}

const getRelation = (mainId: MainId): string => {
  switch (mainId) {
    case MainId.categories: {
      return "→";
    }

    case MainId.priorities: {
      return ">";
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
  const relation = getRelation(mainId);
  const {
    relationId,
    loading,
    error,
  } = clientManager.apolloHooksManager.useRelation(relation);

  if (loading) return <span />;
  if (error || !relationId) return <p>ERROR</p>;

  let cards: JSX.Element;

  switch (relation) {
    case "→": {
      cards = (
        <TwoOneCards
          currentPath={clientManager.select(getCurrentPath)}
          relationId={relationId}
          mainId={mainId}
        />
      );
      break;
    }

    case ">": {
      cards = (
        <TwoSortCards
          currentPath={clientManager.select(getCurrentPath)}
          relationId={relationId}
          mainId={mainId}
        />
      );
      break;
    }

    default: {
      cards = <TwoCards relationId={relationId} mainId={mainId} />;
    }
  }

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        {cards}
      </Container>
    </main>
  );
};

export default Main;
