import { DataSources, QueryResolvers } from "../types";

export const queryResolvers: Required<Omit<
  QueryResolvers<DataSources, {}>,
  "_empty"
>> = {
  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),
  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),
  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),

  itemWithRelatedItems: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.getAllRelatedItems(item),
};
