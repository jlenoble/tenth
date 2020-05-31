export * from "./current-path";
export * from "./items";
export * from "./relationships";
export * from "./relationships-for-item";
export * from "./views-for-item";
export * from "./views-for-subitem";

import { Data, Meta, MetaAction } from "../types";

export const CREATE_RELATED_ITEM = "CREATE_RELATED_ITEM";
export const DESTROY_ITEM = "DESTROY_ITEM";

export type CreateRelatedItemAction = MetaAction<{
  type: typeof CREATE_RELATED_ITEM;
  payload: Data["createRelatedItem"]["createRelatedItem"];
}>;

export type DestroyItemAction = MetaAction<{
  type: typeof DESTROY_ITEM;
  payload: Data["destroyItem"]["destroyItem"];
}>;

export const createRelatedItem = (
  item: Data["createRelatedItem"]["createRelatedItem"],
  meta: Meta
): CreateRelatedItemAction => ({
  type: CREATE_RELATED_ITEM,
  payload: item,
  meta,
});

export const destroyItem = (
  item: Data["destroyItem"]["destroyItem"],
  meta: Meta
): DestroyItemAction => ({
  type: DESTROY_ITEM,
  payload: item,
  meta,
});
