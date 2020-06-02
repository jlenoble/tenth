import React, { FunctionComponent } from "react";
import { Breadcrumbs as BaseBreadcrumbs } from "@material-ui/core";
import { clientManager } from "../../apollo-client-manager";
import { Link } from "../../components";
import { ItemId } from "../../../types";

export const Breadcrumbs: FunctionComponent<{
  currentPath: ItemId[];
  moveBack: (index: number) => () => void;
}> = ({ currentPath, moveBack }) => {
  const {
    friendlyCurrentPath,
  } = clientManager.apolloHooksManager.useBreadcrumbs(currentPath);

  return (
    <BaseBreadcrumbs aria-label="breadcrumb">
      {friendlyCurrentPath.map((path, i, a) =>
        i !== a.length - 1 ? (
          <Link key={i} color="inherit" to="/" onClick={moveBack(i)}>
            {path}
          </Link>
        ) : (
          <Link
            key={path}
            color="textPrimary"
            to="/"
            onClick={moveBack(i)}
            aria-current="page"
          >
            {path}
          </Link>
        )
      )}
    </BaseBreadcrumbs>
  );
};
