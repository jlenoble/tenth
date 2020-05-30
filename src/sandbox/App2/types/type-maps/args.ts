import * as Generated from "../../__generated__";

export interface Args {
  item: Generated.QueryItemArgs;
  itemsById: Generated.QueryItemsByIdArgs;
  itemWithRelatedItems: Generated.QueryItemWithRelatedItemsArgs;
  coreItem: Generated.QueryCoreItemArgs;
  relationshipsForItem: Generated.QueryRelationshipsForItemArgs;
  relationshipsForItemAndRelation: Generated.QueryRelationshipsForItemAndRelationArgs;
  relationshipsForLeftItemAndRelation: Generated.QueryRelationshipsForLeftItemAndRelationArgs;
  relationshipsForRightItemAndRelation: Generated.QueryRelationshipsForRightItemAndRelationArgs;

  createItem: Generated.MutationCreateItemArgs;
  updateItem: Generated.MutationUpdateItemArgs;
  destroyItem: Generated.MutationDestroyItemArgs;
  destroyItems: Generated.MutationDestroyItemsArgs;
  createRelatedItem: Generated.MutationCreateRelatedItemArgs;
  destroyRelatedItem: Generated.MutationDestroyRelatedItemArgs;
  destroyRelationships: Generated.MutationDestroyRelationshipsArgs;
}
