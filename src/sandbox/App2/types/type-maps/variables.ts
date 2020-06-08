import * as Generated from "../../__generated__";

export interface Variables {
  items: Generated.GetItemsQueryVariables;
  itemsById: Generated.GetItemsByIdQueryVariables;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQueryVariables;
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
  destroyRelatedItem: Generated.DestroyRelatedItemMutationVariables;
  destroyRelationships: Generated.DestroyRelationshipsMutationVariables;
}
