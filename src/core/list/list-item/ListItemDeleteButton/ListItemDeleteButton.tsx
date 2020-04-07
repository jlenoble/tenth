import React, { FunctionComponent } from "react";
import { IconButtonProps } from "@material-ui/core/IconButton";
import DeleteButton from "../../../stateless/DeleteButton";

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
}) => <DeleteButton onClick={() => removeItem && removeItem(id)} {...other} />;
