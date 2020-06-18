import * as Generated from "../../__generated__";

export interface Args {
  item: Generated.QueryItemArgs;
  itemsById: Generated.QueryItemsByIdArgs;
  itemWithRelatedItems: Generated.QueryItemWithRelatedItemsArgs;
  itemWithOrderedItems: Generated.QueryItemWithOrderedItemsArgs;

  coreItem: Generated.QueryCoreItemArgs;

  relationshipsForItem: Generated.QueryRelationshipsForItemArgs;
  relationshipsForItemAndRelation: Generated.QueryRelationshipsForItemAndRelationArgs;
  relationshipsForLeftItemAndRelation: Generated.QueryRelationshipsForLeftItemAndRelationArgs;
  relationshipsForRightItemAndRelation: Generated.QueryRelationshipsForRightItemAndRelationArgs;

  createItem: Generated.MutationCreateItemArgs;
  destroyItem: Generated.MutationDestroyItemArgs;
  destroyItems: Generated.MutationDestroyItemsArgs;
  updateItem: Generated.MutationUpdateItemArgs;

  createRelatedItem: Generated.MutationCreateRelatedItemArgs;
  createOrderedItem: Generated.MutationCreateOrderedItemArgs;
  destroyRelatedItem: Generated.MutationDestroyRelatedItemArgs;
  createRelationships: Generated.MutationCreateRelationshipsArgs;
  destroyRelationships: Generated.MutationDestroyRelationshipsArgs;
  updateRelationship: Generated.MutationUpdateRelationshipArgs;
}
