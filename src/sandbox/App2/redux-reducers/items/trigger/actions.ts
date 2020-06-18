import { Data } from "../../../types";
import {
  TRIGGER_CREATE_RELATED_ITEM,
  TRIGGER_CREATE_ORDERED_ITEM,
  TRIGGER_DESTROY_ITEM,
  TRIGGER_UPDATE_ITEM,
} from "./consts";

export type TriggerCreateRelatedItemAction = {
  type: typeof TRIGGER_CREATE_RELATED_ITEM;
  payload: Data["createRelatedItem"]["createRelatedItem"];
};

export type TriggerCreateOrderedItemAction = {
  type: typeof TRIGGER_CREATE_ORDERED_ITEM;
  payload: Data["createOrderedItem"]["createOrderedItem"];
};

export type TriggerDestroyItemAction = {
  type: typeof TRIGGER_DESTROY_ITEM;
  payload: Data["destroyItem"]["destroyItem"];
};

export type TriggerUpdateItemAction = {
  type: typeof TRIGGER_UPDATE_ITEM;
  payload: Data["updateItem"]["updateItem"];
};
