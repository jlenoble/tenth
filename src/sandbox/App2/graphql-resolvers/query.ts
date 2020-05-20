import { DataSources, QueryResolvers } from "../types";

export const queryResolvers: Required<Omit<
  QueryResolvers<DataSources, {}>,
  "_empty"
>> = {
  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),

  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),
  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),

  itemWithRelatedItems: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.getAllRelatedItems(item),
};
