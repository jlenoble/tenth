export * from "./managers";
export * from "./models";
export * from "./states";
export * from "./type-maps";

import { ApolloClientManagerInterface } from "./managers";

export type Meta = {
  optimisticId: number;
  begin: boolean;
  manager: ApolloClientManagerInterface;
};
export type MetaAction<Action> = Action & { meta: Meta };

export type {
  RelatedItem,
  ItemWithRelatedItems,
  QueryResolvers,
  MutationResolvers,
  ResolverFn,
} from "../__generated__";

// Keep last, to prevent circularity, as api depends on server/api
// and the latter depends on generated types
export * from "./api";
