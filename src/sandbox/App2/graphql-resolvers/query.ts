import { QueryResolvers, DataSources } from "../types";

export const queryResolvers: QueryResolvers<DataSources, {}> = {
  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),

  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),

  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),

  relatedItems: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.getAllItems(item),
};
