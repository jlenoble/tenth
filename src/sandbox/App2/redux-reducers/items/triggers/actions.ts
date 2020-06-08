import { Data } from "../../../types";
import { CREATE_RELATED_ITEM, DESTROY_ITEM, UPDATE_ITEM } from "./consts";

export type CreateRelatedItemAction = {
  type: typeof CREATE_RELATED_ITEM;
  payload: Data["createRelatedItem"]["createRelatedItem"];
};

export type DestroyItemAction = {
  type: typeof DESTROY_ITEM;
  payload: Data["destroyItem"]["destroyItem"];
};

export type UpdateItemAction = {
  type: typeof UPDATE_ITEM;
  payload: Data["updateItem"]["updateItem"];
};
