import { GQLUser } from "./__types__/schema";
import { LaunchAPI } from "./datasources/launch";
import { UserAPI } from "./datasources/user";

type Context = {
  dataSources: { launchAPI: LaunchAPI; userAPI: UserAPI<{ user?: GQLUser }> };
};

export const resolvers = {
  Query: {
    launches: (_: any, __: any, { dataSources }: Context) =>
      dataSources.launchAPI.getAllLaunches(),
    launch: (_: any, { id }: { id: number }, { dataSources }: Context) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: (_: any, __: any, { dataSources }: Context) =>
      dataSources.userAPI.findOrCreateUser()
  }
};
