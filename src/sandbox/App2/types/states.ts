import { ItemId, ClientItem, ClientRelationship, ViewId } from "./models";

export type CurrentPathState = ItemId[];
export type ItemsState = Map<ItemId, ClientItem>;
export type NCardsState = number;
export type RelationshipsState = Map<ItemId, ClientRelationship>;
export type RelationshipsForItemState = Map<ItemId, Set<string>>;
export type ViewsForItemState = Map<ItemId, Set<ViewId>>;
export type ViewsForSubItemState = ViewsForItemState;

export type State = {
  currentPath: CurrentPathState;
  items: ItemsState;
  nCards: NCardsState;
  relationships: RelationshipsState;
  relationshipsForItem: RelationshipsForItemState;
  viewsForItem: ViewsForItemState;
  viewsForSubItem: ViewsForSubItemState;
};
