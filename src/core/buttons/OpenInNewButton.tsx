import React, { FunctionComponent } from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { OpenInNewOutlined } from "@material-ui/icons";
import { expandLabel } from "./aria-labels";

export type OpenInNewButtonProps = IconButtonProps;

export const OpenInNewButton: FunctionComponent<OpenInNewButtonProps> = (
  props
) => {
  return (
    <IconButton aria-label={expandLabel} {...props}>
      <OpenInNewOutlined />
    </IconButton>
  );
};

export default OpenInNewButton;
