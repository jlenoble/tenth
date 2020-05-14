import { IResolvers } from "graphql-tools";
import { DataSources } from "../api";
import { GQLQueryTypeResolver } from "./query";
import { GQLMutationTypeResolver } from "./mutation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GQLResolver<TParent = any, TContext = DataSources>
  extends IResolvers<TParent, TContext> {
  Query: GQLQueryTypeResolver<TParent, TContext>;
  Mutation: GQLMutationTypeResolver<TParent, TContext>;
}

export * from "./query";
export * from "./mutation";
