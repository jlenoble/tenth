import React, { FunctionComponent } from "react";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import { Item, ItemHooks } from "../../types";

export interface Props extends IconButtonProps {
  item: Item;
  itemHooks: ItemHooks;
}

export const ListItemDeleteButton: FunctionComponent<Props> = ({
  item: { id },
  itemHooks: { removeItem }
}) => (
  <IconButton
    aria-label="Delete item"
    onClick={() => removeItem && removeItem(id)}
  >
    <DeleteOutlined />
  </IconButton>
);
