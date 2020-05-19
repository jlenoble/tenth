import { DataSources } from "../types";
import { MutationResolvers } from "../__generated__";

export const mutationResolvers: Required<Omit<
  MutationResolvers<DataSources, {}>,
  "_empty"
>> = {
  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),
  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),
  destroyItem: async (_, item, { dataSources: { itemAPI, relationAPI } }) => {
    const res = await Promise.all([
      itemAPI.destroyItem(item),
      relationAPI.destroyRelationsForItem(item),
    ]);

    return res[0];
  },

  createRelatedItem: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.createRelatedItem(item),
};
