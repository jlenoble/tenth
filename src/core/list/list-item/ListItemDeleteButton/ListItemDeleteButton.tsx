import React, { FunctionComponent } from "react";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";

export interface Item {
  id: string;
}

export interface ItemHooks {
  removeItem?: (id: string) => void;
}

export interface Props extends IconButtonProps {
  item: Item;
  itemHooks: ItemHooks;
}

export const ListItemDeleteButton: FunctionComponent<Props> = ({
  item: { id },
  itemHooks: { removeItem },
  ...other
}) => (
  <IconButton
    aria-label="Delete item"
    onClick={removeItem && (() => removeItem(id))}
    {...other}
  >
    <DeleteOutlined />
  </IconButton>
);
