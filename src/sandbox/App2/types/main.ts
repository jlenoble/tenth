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
  createItem: Generated.CreateItemMutation;
  destroyItem: Generated.DestroyItemMutation;
  createRelatedItem: Generated.CreateRelatedItemMutation;
}

export interface Args {
  item: Generated.QueryItemArgs;
  itemWithRelatedItems: Generated.QueryItemWithRelatedItemsArgs;
  createItem: Generated.MutationCreateItemArgs;
  updateItem: Generated.MutationUpdateItemArgs;
  destroyItem: Generated.MutationDestroyItemArgs;
  createRelatedItem: Generated.MutationCreateRelatedItemArgs;
}

export interface Variables {
  items: Generated.GetItemsQueryVariables;
  itemWithRelatedItems: Generated.GetItemWithRelatedItemsQueryVariables;
  createItem: Generated.CreateItemMutationVariables;
  destroyItem: Generated.DestroyItemMutationVariables;
  createRelatedItem: Generated.CreateRelatedItemMutationVariables;
}
