import {
  ItemId,
  RelationshipId,
  ClientItem,
  ClientRelationship,
  ViewId,
  Order,
} from "./models";

export type CurrentPathState = ItemId[];
export type ItemsState = Map<ItemId, ClientItem>;
export type NCardsState = number;
export type OrdersState = Map<
  ItemId,
  Map<ItemId, Map<ItemId, { starts?: Order; ends?: Order }>>
>;
export type RelationshipsState = Map<ItemId, ClientRelationship>;
export type RelationshipsForItemState = Map<
  ItemId,
  Map<RelationshipId, ClientRelationship>
>;
export type ViewsForItemState = Map<ItemId, Set<ViewId>>;
export type ViewsForSubItemState = ViewsForItemState;

export type State = {
  currentPath: CurrentPathState;
  items: ItemsState;
  nCards: NCardsState;
  orders: OrdersState;
  relationships: RelationshipsState;
  relationshipsForItem: RelationshipsForItemState;
  viewsForItem: ViewsForItemState;
  viewsForSubItem: ViewsForSubItemState;
};
