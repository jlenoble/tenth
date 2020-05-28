import { DataSources, QueryResolvers } from "../types";

export const queryResolvers: Required<Omit<
  QueryResolvers<DataSources, Record<string, unknown>>,
  "_empty"
>> = {
  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),

  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),
  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),
  itemsById: (_, items, { dataSources: { itemAPI } }) =>
    itemAPI.getItemsById(items),

  coreItems: (_, __, { dataSources: { itemAPI } }) => itemAPI.getCoreItems(),
  coreItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.getCoreItemByTitle(item),

  itemWithRelatedItems: (_, item, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.getAllRelatedItems(item),

  relationshipsForItem: (_, item, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.getRelationshipsForItem(item),
};
