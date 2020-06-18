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

  createRelatedItem: async (_, _item, { dataSources: { relationshipAPI } }) => {
    const { item, relationship } = await relationshipAPI.createRelatedItem(
      _item
    );
    return { item: item.values, relationship: relationship.values };
  },
  createOrderedItem: (_, item, { dataSources }) => {
    const dataManager = new DbDataManager(dataSources);
    return dataManager.createOrderedItem(item);
  },

  updateRelationship: (_, relationship, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.updateRelationship(relationship),
};
