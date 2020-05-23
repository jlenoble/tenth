import { ADD, REMOVE } from "./consts";
import { ItemId, GQLItem } from "../../types";

export type AddAction = {
  type: typeof ADD;
  item: GQLItem;
};

export type RemoveAction = {
  type: typeof REMOVE;
  id: ItemId;
};

export type Action = AddAction | RemoveAction;
