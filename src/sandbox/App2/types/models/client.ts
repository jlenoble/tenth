import { ItemId, RelationshipId, UserId } from "./server";

export type ViewId = string;

export type Ids = [ItemId, ItemId, ItemId];
export type ViewForItem = { id: ItemId; viewId: ViewId };
export type ViewForSubItem = ViewForItem;

export type ClientItem = { id: ItemId; title: string };
export type ClientUser = { id: UserId; email: string };
export type ClientRelationship = {
  id: RelationshipId;
  ids: ItemId[];
};
