import { GQLMutationTypeResolver } from "../types";

export const mutationResolvers: GQLMutationTypeResolver = {
  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),

  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),

  destroyItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.destroyItem(item),
};
