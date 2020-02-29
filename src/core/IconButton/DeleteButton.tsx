import React, { FunctionComponent } from "react";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import { IconButton, IconButtonProps, IconButtonItemHooks } from "./IconButton";

export interface DeleteButtonItemHooks extends IconButtonItemHooks {
  removeItem: (id: string) => void;
}

export interface DeleteButtonProps extends IconButtonProps {
  itemHooks: DeleteButtonItemHooks;
}

export const DeleteButton: FunctionComponent<DeleteButtonProps> = ({
  item: { id },
  itemHooks: { removeItem },
  ...other
}) => (
  <IconButton
    aria-label="Delete item"
    onClick={() => removeItem(id)}
    {...other}
  >
    <DeleteOutlined />
  </IconButton>
);
