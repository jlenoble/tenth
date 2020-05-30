import { ItemId, ClientItem, ClientRelationship, ViewId } from "./models";

export type CurrentPathState = ItemId[];
export type ItemsState = Map<ItemId, ClientItem>;
export type RelationshipsState = Map<ItemId, ClientRelationship>;
export type RelationshipsForItemState = Map<ItemId, Set<string>>;
export type ViewsForItemState = Map<ItemId, Set<ViewId>>;
export type ViewsForSubItemState = Map<ItemId, Set<ViewId>>;

export type State = {
  currentPath: CurrentPathState;
  items: ItemsState;
  relationships: RelationshipsState;
  relationshipsForItem: RelationshipsForItemState;
  viewsForItem: ViewsForItemState;
  viewsForSubItem: ViewsForSubItemState;
};
