import * as Generated from "../__generated__";

interface SequelizeDefaultAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type ItemId = Generated.Item["id"];
export type UserId = Generated.User["id"];
export type RelationId = Generated.Relationship["id"];

export type GQLItem = Generated.Item & SequelizeDefaultAttributes;
export type GQLUser = Generated.User & SequelizeDefaultAttributes;
export type GQLRelationship = Generated.Relationship &
  SequelizeDefaultAttributes;

export type {
  RelatedItem,
  ItemWithRelatedItems,
  QueryResolvers,
  MutationResolvers,
} from "../__generated__";

export interface Data {
  items: Generated.GetItemsQuery;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQuery;
  coreItems: Generated.GetCoreItemsQuery;

  createItem: Generated.CreateItemMutation;
  destroyItem: Generated.DestroyItemMutation;
  createRelatedItem: Generated.CreateRelatedItemMutation;
}

export interface Args {
  item: Generated.QueryItemArgs;
  itemWithRelatedItems: Generated.QueryItemWithRelatedItemsArgs;
  coreItem: Generated.QueryCoreItemArgs;

  createItem: Generated.MutationCreateItemArgs;
  updateItem: Generated.MutationUpdateItemArgs;
  destroyItem: Generated.MutationDestroyItemArgs;
  createRelatedItem: Generated.MutationCreateRelatedItemArgs;
}

export interface Variables {
  items: Generated.GetItemsQueryVariables;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQueryVariables;
  coreItems: Generated.GetCoreItemsQueryVariables;

  createItem: Generated.CreateItemMutationVariables;
  destroyItem: Generated.DestroyItemMutationVariables;
  createRelatedItem: Generated.CreateRelatedItemMutationVariables;
}
