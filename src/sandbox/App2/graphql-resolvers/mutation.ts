import { DataSources, MutationResolvers } from "../types";

export const mutationResolvers: Required<Omit<
  MutationResolvers<DataSources, {}>,
  "_empty"
>> = {
  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),
  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),
  destroyItem: async (_, item, { dataSources: { itemAPI, relationAPI } }) => {
    const gqlItem = await itemAPI.destroyItem(item);
    await relationAPI.destroyRelationsForItem(item, gqlItem.userId);
    return gqlItem;
  },

  createRelatedItem: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.createRelatedItem(item),
};
