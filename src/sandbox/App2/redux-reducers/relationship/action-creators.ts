import { ItemId } from "../../types";
import { ADD, REMOVE } from "./consts";
import { Action } from "./actions";

export const add = (ids: [ItemId, ItemId, ItemId]): Action => ({
  type: ADD,
  ids,
});

export const remove = (ids: [ItemId, ItemId, ItemId]): Action => ({
  type: REMOVE,
  ids,
});
