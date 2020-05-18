import { DataSources } from "../types";
import { QueryResolvers } from "../__generated__";

export const queryResolvers: Required<Omit<
  QueryResolvers<DataSources, {}>,
  "_empty"
>> = {
  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),
  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),
  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),

  itemWithRelatedItems: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.getAllItems(item),
};
