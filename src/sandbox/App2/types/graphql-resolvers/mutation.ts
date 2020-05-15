import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver, IResolverObject } from "graphql-tools";
import { GQLItem, ItemId } from "../graphql-schemas";

export interface GQLMutationTypeResolver<TParent, TContext>
  extends IResolverObject<TParent, TContext> {
  createItem: MutationToCreateItemResolver<TParent, TContext>;
  updateItem: MutationToUpdateItemResolver<TParent, TContext>;
  destroyItem: MutationToDestroyItemResolver<TParent, TContext>;
}

export interface MutationToCreateItemArgs {
  title: string;
}
export interface MutationToCreateItemResolver<
  TParent,
  TContext,
  TArgs = MutationToCreateItemArgs
> extends IFieldResolver<TParent, TContext, TArgs> {
  (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<GQLItem | null>;
}

export interface MutationToUpdateItemArgs {
  id: ItemId;
  title?: string;
}
export interface MutationToUpdateItemResolver<
  TParent,
  TContext,
  TArgs = MutationToUpdateItemArgs
> extends IFieldResolver<TParent, TContext, TArgs> {
  (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<GQLItem | null>;
}

export interface MutationToDestroyItemArgs {
  id: ItemId;
}
export interface MutationToDestroyItemResolver<
  TParent,
  TContext,
  TArgs = MutationToDestroyItemArgs
> extends IFieldResolver<TParent, TContext, TArgs> {
  (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<GQLItem | null>;
}
