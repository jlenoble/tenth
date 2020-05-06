import { DataSource, DataSourceConfig } from "apollo-datasource";
import isEmail from "isemail";
import { GQLUser } from "../__types__/schema";
import { Store, Trip, User, TripDataType } from "../server/utils";

export class UserAPI<Context extends { user?: GQLUser }> extends DataSource<
  Context
> {
  private context: Context | undefined;
  private store: Store;

  constructor({ store }: { store: Store }) {
    super();
    this.store = store;
  }

  /*
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ email: emailArg }: Partial<GQLUser> = {}) {
    const email = this.context?.user?.email || emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate<User>({
      where: { email },
    });
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({ launchIds }: { launchIds: readonly string[] }) {
    const userId = this.context?.user?.id;
    if (!userId) return;

    const results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }: { launchId: string }) {
    const userId = this.context?.user?.id;
    if (!userId) return;

    const res = await this.store.trips.findOrCreate<Trip>({
      where: { userId, launchId },
    });
    return res && res.length ? (res[0].get() as { id: number }) : false;
  }

  async cancelTrip({ launchId }: { launchId: string }) {
    const userId = this.context?.user?.id;
    if (!userId) return;

    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    const userId = this.context?.user?.id;
    if (!userId) return;

    const found = await this.store.trips.findAll<Trip>({
      where: { userId },
    });

    return found && found.length
      ? found.map((l) => l.dataValues.launchId).filter((l) => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }: { launchId: string }) {
    if (!this.context || !this.context.user) return false;

    const userId = this.context.user.id;
    const found = await this.store.trips.findAll<Trip>({
      where: { userId, launchId },
    });

    return found && found.length > 0;
  }
}
