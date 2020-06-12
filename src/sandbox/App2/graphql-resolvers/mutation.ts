import { DataSources, MutationResolvers } from "../types";
import { DbDataManager } from "../managers";

export const mutationResolvers: Required<Omit<
  MutationResolvers<DataSources, Record<string, unknown>>,
  | "_empty"
  | "destroyRelatedItem"
  | "createRelationships"
  | "destroyRelationships"
>> = {
  optimisticId: (_, { optimisticId }) => (optimisticId ? -optimisticId : null),

  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),
  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),
  destroyItem: async (_, item, { dataSources }) => {
    const dataManager = new DbDataManager(dataSources);
    const destroyedData = await dataManager.destroyItem(item.id);
    return destroyedData.item;
  },

  destroyItems: (_, items, { dataSources: { itemAPI } }) =>
    itemAPI.destroyItems(items),

  createRelatedItem: (_, item, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.createRelatedItem(item),
};
