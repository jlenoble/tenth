import React, { FunctionComponent } from "react";
import { Link as ReachLink, LinkProps as RouterLinkProps } from "@reach/router";
import { Link as MuiLink, LinkProps } from "@material-ui/core";

export const Link: FunctionComponent<RouterLinkProps<void> & LinkProps> = (
  props
) => {
  return <MuiLink component={ReachLink} {...props} />;
};

export default Link;
