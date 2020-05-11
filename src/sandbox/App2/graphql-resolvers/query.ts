/* eslint-disable @typescript-eslint/no-explicit-any */

import { APIMap } from "../server/datasources";
import { User } from "../server/db";

export const queryResolverMap = {
  // items: (
  //   _: any,
  //   __: any,
  //   { dataSources: { itemAPI } }: { dataSources: APIMap }
  // ) => itemAPI.getAllItems(),
  // item: (
  //   _: any,
  //   { id }: {id: number},
  //   { dataSources: { itemAPI } }: { dataSources: APIMap }
  // ) => itemAPI.getItemById({ item: id }),
  me: (
    _: any,
    __: any,
    { dataSources: { userAPI } }: { dataSources: APIMap }
  ): Promise<User | null> => userAPI.findOrCreateUser(),
};
