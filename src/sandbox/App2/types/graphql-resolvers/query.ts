import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver, IResolverObject } from "graphql-tools";
import { GQLItem, GQLUser, ItemId } from "../graphql-schemas";

export interface GQLQueryTypeResolver<TParent, TContext>
  extends IResolverObject<TParent, TContext> {
  items: QueryToItemsResolver<TParent, TContext>;
  item: QueryToItemResolver<TParent, TContext>;
  me: QueryToMeResolver<TParent, TContext>;
}

export interface QueryToItemsResolver<TParent, TContext, TArgs = {}>
  extends IFieldResolver<TParent, TContext, TArgs> {
  (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<GQLItem[]>;
}

export interface QueryToItemArgs {
  id: ItemId;
}
export interface QueryToItemResolver<
  TParent,
  TContext,
  TArgs = QueryToItemArgs
> extends IFieldResolver<TParent, TContext, TArgs> {
  (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<GQLItem | null>;
}

export interface QueryToMeResolver<TParent, TContext, TArgs = {}>
  extends IFieldResolver<TParent, TContext, TArgs> {
  (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<GQLUser | null>;
}
