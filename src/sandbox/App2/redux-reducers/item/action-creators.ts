import { ItemId, GQLItem } from "../../types";
import { ADD, REMOVE } from "./consts";
import { Action } from "./actions";

export const add = (item: GQLItem): Action => ({
  type: ADD,
  item,
});

export const remove = (id: ItemId): Action => ({
  type: REMOVE,
  id,
});
