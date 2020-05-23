import { ADD, REMOVE } from "./consts";
import { ItemId } from "../../types";

export type AddAction = {
  type: typeof ADD;
  ids: [ItemId, ItemId, ItemId];
};

export type RemoveAction = {
  type: typeof REMOVE;
  ids: [ItemId, ItemId, ItemId];
};

export type Action = AddAction | RemoveAction;
