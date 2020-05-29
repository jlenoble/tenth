import * as Generated from "../__generated__";

interface SequelizeDefaultAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type ItemId = Generated.Item["id"];
export type UserId = Generated.User["id"];
export type RelationshipId = Generated.Relationship["id"];

export type GQLItem = Generated.Item & SequelizeDefaultAttributes;
export type GQLUser = Generated.User & SequelizeDefaultAttributes;
export type GQLRelationship = Generated.Relationship &
  SequelizeDefaultAttributes;

export type CurrentPathState = ItemId[];
export type RelationshipsForItemState = Map<ItemId, Set<string>>;

export type State = {
  currentPath: CurrentPathState;
  relationshipsForItem: RelationshipsForItemState;
};

export type Ids = [ItemId, ItemId, ItemId];

export type {
  RelatedItem,
  ItemWithRelatedItems,
  QueryResolvers,
  MutationResolvers,
  ResolverFn,
} from "../__generated__";

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

export interface Variables {
  items: Generated.GetItemsQueryVariables;
  itemsById: Generated.GetItemsByIdQueryVariables;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQueryVariables;
  coreItems: Generated.GetCoreItemsQueryVariables;
  relationshipsForItem: Generated.GetRelationshipsForItemQueryVariables;
  relationshipsForItemAndRelation: Generated.GetRelationshipsForItemAndRelationQueryVariables;
  relationshipsForLeftItemAndRelation: Generated.GetRelationshipsForLeftItemAndRelationQueryVariables;
  relationshipsForRightItemAndRelation: Generated.GetRelationshipsForRightItemAndRelationQueryVariables;

  createItem: Generated.CreateItemMutationVariables;
  destroyItem: Generated.DestroyItemMutationVariables;
  destroyItems: Generated.DestroyItemsMutationVariables;
  createRelatedItem: Generated.CreateRelatedItemMutationVariables;
  destroyRelatedItem: Generated.DestroyRelatedItemMutationVariables;
  destroyRelationships: Generated.DestroyRelationshipsMutationVariables;
}
