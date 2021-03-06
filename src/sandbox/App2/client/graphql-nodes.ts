import * as Generated from "../__generated__";

export const nodes = {
  items: Generated.GetItems,
  itemsById: Generated.GetItemsById,
  itemWithRelatedItems: Generated.GetItemWithRelatedItems,
  itemWithOrderedItems: Generated.GetItemWithOrderedItems,

  coreItem: Generated.GetCoreItem,
  coreItems: Generated.GetCoreItems,

  relationshipsForItem: Generated.GetRelationshipsForItem,
  relationshipsForItemAndRelation: Generated.GetRelationshipsForItemAndRelation,
  relationshipsForLeftItemAndRelation:
    Generated.GetRelationshipsForLeftItemAndRelation,
  relationshipsForRightItemAndRelation:
    Generated.GetRelationshipsForRightItemAndRelation,

  createItem: Generated.CreateItem,
  destroyItem: Generated.DestroyItem,
  destroyItems: Generated.DestroyItems,
  updateItem: Generated.UpdateItem,

  createRelatedItem: Generated.CreateRelatedItem,
  createOrderedItem: Generated.CreateOrderedItem,
  destroyRelatedItem: Generated.DestroyRelatedItem,
  destroyRelationships: Generated.DestroyRelationships,
  updateRelationship: Generated.UpdateRelationship,
};
