import { ItemId, GQLItem, GQLRelationship, ViewId } from "./models";

export type CurrentPathState = ItemId[];
export type ItemsState = Map<ItemId, GQLItem>;
export type RelationshipsState = Map<ItemId, GQLRelationship>;
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
