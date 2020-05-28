import { DataSources, MutationResolvers } from "../types";
import { DbDataManager } from "../managers";

export const mutationResolvers: Required<Omit<
  MutationResolvers<DataSources, Record<string, unknown>>,
  "_empty" | "destroyRelatedItem" | "destroyRelationships"
>> = {
  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),
  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),
  destroyItem: async (_, item, { dataSources }) => {
    const dataManager = new DbDataManager(dataSources);
    return dataManager.destroyItem(item.id);
  },

  destroyItems: (_, items, { dataSources: { itemAPI } }) =>
    itemAPI.destroyItems(items),

  createRelatedItem: (_, item, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.createRelatedItem(item),
};
