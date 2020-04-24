import React, { FunctionComponent } from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import { deleteLabel } from "./aria-labels";

export type DeleteButtonProps = IconButtonProps;

export const DeleteButton: FunctionComponent<DeleteButtonProps> = (props) => {
  return (
    <IconButton aria-label={deleteLabel} {...props}>
      <DeleteOutlined />
    </IconButton>
  );
};

export default DeleteButton;
