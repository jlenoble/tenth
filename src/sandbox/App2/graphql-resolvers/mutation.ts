import { DataSources } from "../types";
import { MutationResolvers } from "../__generated__";

export const mutationResolvers: Required<MutationResolvers<DataSources, {}>> = {
  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),
  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),
  destroyItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.destroyItem(item),

  createRelatedItem: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.createItem(item),
};
