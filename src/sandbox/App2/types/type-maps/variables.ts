import * as Generated from "../../__generated__";

export interface Variables {
  items: Generated.GetItemsQueryVariables;
  itemsById: Generated.GetItemsByIdQueryVariables;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQueryVariables;
  itemWithOrderedItems: Generated.GetItemWithOrderedItemsQueryVariables;

  coreItem: Generated.GetCoreItemQueryVariables;
  coreItems: Generated.GetCoreItemsQueryVariables;

  relationshipsForItem: Generated.GetRelationshipsForItemQueryVariables;
  relationshipsForItemAndRelation: Generated.GetRelationshipsForItemAndRelationQueryVariables;
  relationshipsForLeftItemAndRelation: Generated.GetRelationshipsForLeftItemAndRelationQueryVariables;
  relationshipsForRightItemAndRelation: Generated.GetRelationshipsForRightItemAndRelationQueryVariables;

  createItem: Generated.CreateItemMutationVariables;
  destroyItem: Generated.DestroyItemMutationVariables;
  destroyItems: Generated.DestroyItemsMutationVariables;
  updateItem: Generated.UpdateItemMutationVariables;

  createRelatedItem: Generated.CreateRelatedItemMutationVariables;
  createOrderedItem: Generated.CreateOrderedItemMutationVariables;
  destroyRelatedItem: Generated.DestroyRelatedItemMutationVariables;
  destroyRelationships: Generated.DestroyRelationshipsMutationVariables;
  updateRelationship: Generated.UpdateRelationshipMutationVariables;
}
