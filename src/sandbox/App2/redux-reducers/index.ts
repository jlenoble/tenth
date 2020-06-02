export * from "./current-path";
export * from "./items";
export * from "./ncards";
export * from "./relationships";
export * from "./relationships-for-item";
export * from "./views-for-item";
export * from "./views-for-subitem";
export * from "./selectors";

import { Data } from "../types";

export const CREATE_RELATED_ITEM = "CREATE_RELATED_ITEM";
export const DESTROY_ITEM = "DESTROY_ITEM";

export type CreateRelatedItemAction = {
  type: typeof CREATE_RELATED_ITEM;
  payload: Data["createRelatedItem"]["createRelatedItem"];
};

export type DestroyItemAction = {
  type: typeof DESTROY_ITEM;
  payload: Data["destroyItem"]["destroyItem"];
};

export const createRelatedItem = (
  item: Data["createRelatedItem"]["createRelatedItem"]
): CreateRelatedItemAction => ({
  type: CREATE_RELATED_ITEM,
  payload: item,
});

export const destroyItem = (
  item: Data["destroyItem"]["destroyItem"]
): DestroyItemAction => ({
  type: DESTROY_ITEM,
  payload: item,
});
