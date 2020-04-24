import React, { FunctionComponent } from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import { closeLabel } from "./aria-labels";

export type CloseButtonProps = IconButtonProps;

export const CloseButton: FunctionComponent<CloseButtonProps> = (props) => {
  return (
    <IconButton aria-label={closeLabel} {...props}>
      <CloseOutlined />
    </IconButton>
  );
};

export default CloseButton;
