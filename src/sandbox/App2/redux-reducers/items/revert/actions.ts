import { ClientItem, ClientRelationship } from "../../../types";
import { REVERT_DESTROY_ITEM, REVERT_UPDATE_ITEM } from "./consts";

export type RevertDestroyItemAction = {
  type: typeof REVERT_DESTROY_ITEM;
  payload: { items: ClientItem[]; relationships: ClientRelationship[] };
};

export type RevertUpdateItemAction = {
  type: typeof REVERT_UPDATE_ITEM;
  payload: ClientItem;
};
