/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GQLQueryTypeResolver,
  DataSources,
  QueryToItemArgs,
  QueryToSubItemsArgs,
} from "../types";

export const queryResolvers: GQLQueryTypeResolver<any, DataSources> = {
  items: (_: any, __: {}, { dataSources: { itemAPI } }: DataSources) =>
    itemAPI.getAllItems(),

  item: (
    _: any,
    item: QueryToItemArgs,
    { dataSources: { itemAPI } }: DataSources
  ) => itemAPI.getItemById(item),

  me: (_: any, __: {}, { dataSources: { userAPI } }: DataSources) =>
    userAPI.findOrCreateUser(),

  subItems: (
    _: any,
    item: QueryToSubItemsArgs,
    { dataSources: { relationAPI } }: DataSources
  ) => relationAPI.getAllItems(item),
};
