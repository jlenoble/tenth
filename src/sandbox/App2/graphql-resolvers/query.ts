import { DataSources } from "../types";
import { QueryResolvers } from "../__generated__";

export const queryResolvers: QueryResolvers<DataSources, {}> = {
  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),
  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),
  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),

  relatedItems: (_, item, { dataSources: { relationAPI } }) =>
    relationAPI.getAllItems(item),
};
