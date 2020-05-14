import { DataSource, DataSourceConfig } from "apollo-datasource";
import isEmail from "isemail";
import { APIContext, GQLUser } from "../../types";
import { Store, User } from "../db";

export class UserAPI<
  Context extends APIContext = APIContext
> extends DataSource<Context> {
  private context: Context | undefined;
  private store: Store;

  constructor({ store }: { store: Store }) {
    super();
    this.store = store;
  }

  initialize(config: DataSourceConfig<Context>): void {
    this.context = config.context;
  }

  async findOrCreateUser({
    email: emailArg,
  }: Partial<GQLUser> = {}): Promise<User | null> {
    const email = this.context?.user?.email || emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.User.findOrCreate<User>({
      where: { email },
    });

    return users && users[0] ? users[0] : null;
  }
}
