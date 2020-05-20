import * as Generated from "../__generated__";

interface SequelizeDefaultAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type ItemId = Generated.Item["id"];
export type UserId = Generated.User["id"];
export type RelationId = Generated.Relation["id"];

export type GQLItem = Generated.Item & SequelizeDefaultAttributes;
export type GQLUser = Generated.User & SequelizeDefaultAttributes;
export type GQLRelation = Generated.Relation & SequelizeDefaultAttributes;

export type {
  ItemWithRelatedItems,
  QueryResolvers,
  MutationResolvers,
} from "../__generated__";

export interface Data {
  items: Generated.GetItemsQuery;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQuery;
  relation: Generated.GetRelationQuery;

  createItem: Generated.CreateItemMutation;
  destroyItem: Generated.DestroyItemMutation;
  createRelatedItem: Generated.CreateRelatedItemMutation;
  createRelation: Generated.CreateRelationMutation;
}

export interface Args {
  item: Generated.QueryItemArgs;
  itemWithRelatedItems: Generated.QueryItemWithRelatedItemsArgs;
  relation: Generated.QueryRelationArgs;

  createItem: Generated.MutationCreateItemArgs;
  updateItem: Generated.MutationUpdateItemArgs;
  destroyItem: Generated.MutationDestroyItemArgs;
  createRelatedItem: Generated.MutationCreateRelatedItemArgs;
  createRelation: Generated.MutationCreateRelationArgs;
}

export interface Variables {
  items: Generated.GetItemsQueryVariables;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQueryVariables;
  relation: Generated.GetRelationQueryVariables;

  createItem: Generated.CreateItemMutationVariables;
  destroyItem: Generated.DestroyItemMutationVariables;
  createRelatedItem: Generated.CreateRelatedItemMutationVariables;
  createRelation: Generated.CreateRelationMutationVariables;
}
