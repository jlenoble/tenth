import * as Generated from "../../__generated__";

export interface Data {
  items: Generated.GetItemsQuery;
  itemsById: Generated.GetItemsByIdQuery;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQuery;
  itemWithOrderedItems: Generated.GetItemWithOrderedItemsQuery;

  coreItem: Generated.GetCoreItemQuery;
  coreItems: Generated.GetCoreItemsQuery;

  relationshipsForItem: Generated.GetRelationshipsForItemQuery;
  relationshipsForItemAndRelation: Generated.GetRelationshipsForItemAndRelationQuery;
  relationshipsForLeftItemAndRelation: Generated.GetRelationshipsForLeftItemAndRelationQuery;
  relationshipsForRightItemAndRelation: Generated.GetRelationshipsForRightItemAndRelationQuery;

  createItem: Generated.CreateItemMutation;
  destroyItem: Generated.DestroyItemMutation;
  destroyItems: Generated.DestroyItemsMutation;
  updateItem: Generated.UpdateItemMutation;

  createRelatedItem: Generated.CreateRelatedItemMutation;
  createOrderedItem: Generated.CreateOrderedItemMutation;
  destroyRelatedItem: Generated.DestroyRelatedItemMutation;
  destroyRelationships: Generated.DestroyRelationshipsMutation;
  updateRelationship: Generated.UpdateRelationshipMutation;
}
