import * as Generated from "../../__generated__";

export interface Data {
  items: Generated.GetItemsQuery;
  itemsById: Generated.GetItemsByIdQuery;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQuery;
  coreItems: Generated.GetCoreItemsQuery;
  relationshipsForItem: Generated.GetRelationshipsForItemQuery;
  relationshipsForItemAndRelation: Generated.GetRelationshipsForItemAndRelationQuery;
  relationshipsForLeftItemAndRelation: Generated.GetRelationshipsForLeftItemAndRelationQuery;
  relationshipsForRightItemAndRelation: Generated.GetRelationshipsForRightItemAndRelationQuery;

  createItem: Generated.CreateItemMutation;
  destroyItem: Generated.DestroyItemMutation;
  destroyItems: Generated.DestroyItemsMutation;
  createRelatedItem: Generated.CreateRelatedItemMutation;
  destroyRelatedItem: Generated.DestroyRelatedItemMutation;
  destroyRelationships: Generated.DestroyRelationshipsMutation;
}