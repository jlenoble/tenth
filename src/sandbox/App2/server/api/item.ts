import { AuthenticationError, ForbiddenError } from "apollo-server";
import { DataSource, DataSourceConfig } from "apollo-datasource";

import { APIContext, GQLItem, UserId, Args } from "../../types";
import { Store, Item } from "../db";

export class ItemAPI<
  Context extends APIContext = APIContext
> extends DataSource<Context> {
  private context: Context | undefined;
  private store: Store;

  private get userId(): UserId {
    const userId = this.context?.user?.id;

    if (!userId) {
      throw new AuthenticationError("not authenticated");
    }

    return userId;
  }

  constructor({ store }: { store: Store }) {
    super();
    this.store = store;
  }

  initialize(config: DataSourceConfig<Context>): void {
    this.context = config.context;
  }

  async createItem({ title }: Args["createItem"]): Promise<GQLItem> {
    const item = await this.store.Item.create<Item>({
      title,
      userId: this.userId,
    });
    return item.values;
  }

  async updateItem({ id, ...args }: Args["updateItem"]): Promise<GQLItem> {
    let item = await this.store.Item.findOne<Item>({
      where: { id, userId: this.userId },
    });

    if (item) {
      item = await item.update(args);
      return item.values;
    }

    throw new ForbiddenError("failed to update");
  }

  async destroyItem({ id }: Args["destroyItem"]): Promise<GQLItem> {
    const item = await this.store.Item.findOne<Item>({
      where: { id, userId: this.userId },
    });

    if (item) {
      await item.destroy();
      return item.values;
    }

    throw new ForbiddenError("failed to destroy");
  }

  async getAllItems(): Promise<GQLItem[]> {
    const items = await this.store.Item.findAll<Item>({
      where: { userId: this.userId },
    });
    return items.map((item) => item.values);
  }

  async getItemById({ id }: Args["item"]): Promise<GQLItem | null> {
    const item = await this.store.Item.findOne<Item>({
      where: { id, userId: this.userId },
    });
    return item ? item.values : null;
  }
}
