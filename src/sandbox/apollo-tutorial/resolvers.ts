import { GQLUser } from "./__types__/schema";
import { LaunchAPI } from "./datasources/launch";
import { UserAPI } from "./datasources/user";
import { paginateResults } from "./utils";

type Context = {
  dataSources: { launchAPI: LaunchAPI; userAPI: UserAPI<{ user?: GQLUser }> };
};

export const resolvers = {
  Query: {
    launches: async (
      _: any,
      { pageSize = 20, after }: { pageSize?: number; after?: string },
      { dataSources }: Context
    ) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse chronological order
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false
      };
    },
    launch: (_: any, { id }: { id: number }, { dataSources }: Context) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: (_: any, __: any, { dataSources }: Context) =>
      dataSources.userAPI.findOrCreateUser()
  }
};
