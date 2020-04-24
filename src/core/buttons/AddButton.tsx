import React, { FunctionComponent } from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { AddOutlined } from "@material-ui/icons";
import { addLabel } from "./aria-labels";

export type AddButtonProps = IconButtonProps;

export const AddButton: FunctionComponent<AddButtonProps> = (props) => {
  return (
    <IconButton aria-label={addLabel} {...props}>
      <AddOutlined />
    </IconButton>
  );
};

export default AddButton;
