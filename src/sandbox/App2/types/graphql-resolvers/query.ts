import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver, IResolverObject } from "graphql-tools";
import { ItemId } from "../graphql-schemas";
import { Item, User } from "../../server/db";

export interface GQLQueryTypeResolver<TParent, TContext>
  extends IResolverObject<TParent, TContext> {
  items: QueryToItemsResolver<TParent, TContext>;
  item: QueryToItemResolver<TParent, TContext>;
  me: QueryToMeResolver<TParent, TContext>;
}

export interface QueryToItemsResolver<TParent, TContext>
  extends IFieldResolver<TParent, TContext> {
  (
    parent: TParent,
    args: {},
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<Item[]>;
}

export interface QueryToItemArgs {
  id: ItemId;
}
export interface QueryToItemResolver<TParent, TContext>
  extends IFieldResolver<TParent, TContext> {
  (
    parent: TParent,
    args: QueryToItemArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<Item | null>;
}

export interface QueryToMeResolver<TParent, TContext>
  extends IFieldResolver<TParent, TContext> {
  (
    parent: TParent,
    args: {},
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<User | null>;
}
