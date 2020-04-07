import React, { FunctionComponent } from "react";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";

export const StatelessDeleteButton: FunctionComponent<IconButtonProps> = ({
  onClick,
  ...other
}) => (
  <IconButton aria-label="Delete item" onClick={onClick} {...other}>
    <DeleteOutlined />
  </IconButton>
);

export default StatelessDeleteButton;
