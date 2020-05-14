import { GQLQueryTypeResolver } from "../types";

export const queryResolvers: GQLQueryTypeResolver = {
  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),
  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),
  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),
};
