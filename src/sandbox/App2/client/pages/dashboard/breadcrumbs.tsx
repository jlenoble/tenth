import React, { FunctionComponent } from "react";
import { Breadcrumbs as BaseBreadcrumbs, Link } from "@material-ui/core";
import { clientManager } from "../../apollo-client-manager";
import { ItemId } from "../../../types";

export const Breadcrumbs: FunctionComponent<{
  childOpened: boolean;
  moveBack: (cards: [ItemId, ItemId]) => void;
}> = ({ childOpened, moveBack }) => {
  const {
    currentPath,
    friendlyCurrentPath,
  } = clientManager.hooks.useBreadcrumbs();

  const handleClick = (index: number) => {
    return () => {
      if (childOpened) {
        if (index > 0) {
          moveBack([currentPath[index - 1], currentPath[index]]);
        } else {
          moveBack([currentPath[0], 0]);
        }
      } else {
        moveBack([currentPath[index], 0]);
      }
    };
  };

  return (
    <BaseBreadcrumbs aria-label="breadcrumb">
      {friendlyCurrentPath.map((path, i, a) =>
        i !== a.length ? (
          <Link key={i} color="inherit" href="/" onClick={handleClick(i)}>
            {path}
          </Link>
        ) : (
          <Link
            key={path}
            color="textPrimary"
            href="/"
            onClick={handleClick(i)}
            aria-current="page"
          >
            {path}
          </Link>
        )
      )}
    </BaseBreadcrumbs>
  );
};
