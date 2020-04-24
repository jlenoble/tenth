import React, { FunctionComponent } from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";

export type DeleteButtonProps = IconButtonProps;

export const DeleteButton: FunctionComponent<DeleteButtonProps> = (props) => {
  return (
    <IconButton aria-label="Delete item" {...props}>
      <DeleteOutlined />
    </IconButton>
  );
};

export default DeleteButton;
