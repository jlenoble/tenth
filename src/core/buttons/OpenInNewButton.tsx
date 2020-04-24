import React, { FunctionComponent } from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { OpenInNewOutlined } from "@material-ui/icons";

export type OpenInNewButtonProps = IconButtonProps;

export const OpenInNewButton: FunctionComponent<OpenInNewButtonProps> = (
  props
) => {
  return (
    <IconButton aria-label="Expand item" {...props}>
      <OpenInNewOutlined />
    </IconButton>
  );
};

export default OpenInNewButton;
