import { RESTDataSource } from "apollo-datasource-rest";
import { GQLLaunch } from "../__types__/spacex-schema";

export class LaunchAPI extends RESTDataSource {
  baseURL = "https://api.spacexdata.com/v2/";

  async getAllLaunches() {
    const response = await this.get("launches");
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : [];
  }

  launchReducer(launch: GQLLaunch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site?.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links?.mission_patch_small,
        missionPatchLarge: launch.links?.mission_patch
      },
      rocket: {
        id: launch.rocket?.rocket_id,
        name: launch.rocket?.rocket_name,
        type: launch.rocket?.rocket_type
      }
    };
  }

  async getLaunchById({ launchId }: { launchId: string }) {
    const response = await this.get("launches", {
      flight_number: parseInt(launchId, 10)
    } as Partial<GQLLaunch>);
    return this.launchReducer(response[0]);
  }

  getLaunchesByIds({ launchIds }: { launchIds: readonly string[] }) {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId }))
    );
  }
}
