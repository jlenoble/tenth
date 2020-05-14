/* eslint-disable @typescript-eslint/no-explicit-any */

import { APIMap } from "../server/datasources";
import { Item, User } from "../server/db";

type DataSources = { dataSources: APIMap };

export const queryResolverMap = {
  items: (
    _: any,
    __: any,
    { dataSources: { itemAPI } }: DataSources
  ): Promise<Item[]> => itemAPI.getAllItems(),

  item: (
    _: any,
    item: { id: number },
    { dataSources: { itemAPI } }: DataSources
  ): Promise<Item | null> => itemAPI.getItemById(item),

  me: (
    _: any,
    __: any,
    { dataSources: { userAPI } }: DataSources
  ): Promise<User | null> => userAPI.findOrCreateUser(),
};
