/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GQLMutationTypeResolver,
  DataSources,
  MutationToCreateItemArgs,
  MutationToUpdateItemArgs,
  MutationToDestroyItemArgs,
} from "../types";

export const mutationResolvers: GQLMutationTypeResolver<any, DataSources> = {
  createItem: (
    _: any,
    item: MutationToCreateItemArgs,
    { dataSources: { itemAPI } }: DataSources
  ) => itemAPI.createItem(item),

  updateItem: (
    _: any,
    item: MutationToUpdateItemArgs,
    { dataSources: { itemAPI } }: DataSources
  ) => itemAPI.updateItem(item),

  destroyItem: (
    _: any,
    item: MutationToDestroyItemArgs,
    { dataSources: { itemAPI } }: DataSources
  ) => itemAPI.destroyItem(item),
};
