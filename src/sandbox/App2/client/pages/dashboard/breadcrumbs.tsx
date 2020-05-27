import React, { FunctionComponent } from "react";
import { Breadcrumbs as BaseBreadcrumbs, Link } from "@material-ui/core";
import { clientManager } from "../../apollo-client-manager";

export const Breadcrumbs: FunctionComponent = () => {
  const { currentPath } = clientManager.hooks.useBreadcrumbs();

  const handleClick = () => {
    // dispatch setPath
    console.log("click");
  };

  return (
    <BaseBreadcrumbs aria-label="breadcrumb">
      {currentPath.map((path, i, a) =>
        i !== a.length ? (
          <Link key={path} color="inherit" href="/" onClick={handleClick}>
            {path}
          </Link>
        ) : (
          <Link
            key={path}
            color="textPrimary"
            href="/"
            onClick={handleClick}
            aria-current="page"
          >
            {path}
          </Link>
        )
      )}
    </BaseBreadcrumbs>
  );
};
