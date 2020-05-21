import { DataSources, MutationResolvers } from "../types";

export const mutationResolvers: Required<Omit<
  MutationResolvers<DataSources, {}>,
  "_empty"
>> = {
  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),
  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),
  destroyItem: async (
    _,
    item,
    { dataSources: { itemAPI, relationshipAPI } }
  ) => {
    const gqlItem = await itemAPI.destroyItem(item);
    await relationshipAPI.destroyRelationshipsForItem(item, gqlItem.userId);
    return gqlItem;
  },

  createRelatedItem: (_, item, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.createRelatedItem(item),
};
