import { GQLLaunch, GQLUser } from "../__types__/schema";
import { LaunchAPI } from "../datasources/launch";
import { UserAPI } from "../datasources/user";
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
        results: allLaunches,
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },
    launch: (_: any, { id }: { id: string }, { dataSources }: Context) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: (_: any, __: any, { dataSources }: Context) =>
      dataSources.userAPI.findOrCreateUser(),
  },

  Mutation: {
    bookTrips: async (
      _: any,
      { launchIds }: { launchIds: readonly string[] },
      { dataSources }: Context
    ) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds,
      });

      return {
        success: results && results.length === launchIds.length,
        message:
          results && results.length === launchIds.length
            ? "trips booked successfully"
            : `the following launches couldn't be booked: ${launchIds.filter(
                (id) =>
                  results && !results.find((res) => res.id === parseInt(id, 10))
              )}`,
        launches,
      };
    },
    cancelTrip: async (
      _: any,
      { launchId }: { launchId: string },
      { dataSources }: Context
    ) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });

      if (!result)
        return {
          success: false,
          message: "failed to cancel trip",
        };

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: "trip cancelled",
        launches: [launch],
      };
    },
    login: async (
      _: any,
      { email }: { email: string },
      { dataSources }: Context
    ) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString("base64");
    },
  },

  Mission: {
    // make sure the default size is 'large' in case user doesn't specify
    missionPatch: (
      mission: {
        name: string;
        missionPatchSmall: string;
        missionPatchLarge: string;
      },
      { size } = { size: "LARGE" }
    ) => {
      return size === "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    },
  },

  Launch: {
    isBooked: async (launch: GQLLaunch, _: any, { dataSources }: Context) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },

  User: {
    trips: async (_: any, __: any, { dataSources }: Context) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds || !launchIds.length) return [];

      // look up those launches by their ids
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      );
    },
  },
};
