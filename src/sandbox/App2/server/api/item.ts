import { DataSource, DataSourceConfig } from "apollo-datasource";
import {
  MutationCreateItemArgs,
  MutationUpdateItemArgs,
  MutationDestroyItemArgs,
  QueryItemArgs,
  APIContext,
  GQLItem,
} from "../../types";
import { Store, Item } from "../db";

export class ItemAPI<
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

  async createItem({ title }: MutationCreateItemArgs): Promise<GQLItem | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    const item = await this.store.Item.create<Item>({ title, userId });
    return item.values;
  }

  async updateItem({
    id,
    ...args
  }: MutationUpdateItemArgs): Promise<GQLItem | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    let item = await this.store.Item.findOne<Item>({ where: { id, userId } });

    if (item) {
      item = await item.update(args);
      return item.values;
    } else {
      return null;
    }
  }

  async destroyItem({ id }: MutationDestroyItemArgs): Promise<GQLItem | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    const item = await this.store.Item.findOne<Item>({ where: { id, userId } });

    if (item) {
      await item.destroy();
      return item.values;
    } else {
      return null;
    }
  }

  async getAllItems(): Promise<GQLItem[]> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return [];
    }

    const items = await this.store.Item.findAll<Item>({ where: { userId } });
    return items.map((item) => item.values);
  }

  async getItemById({ id }: QueryItemArgs): Promise<GQLItem | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    const item = await this.store.Item.findOne<Item>({ where: { id, userId } });
    return item ? item.values : null;
  }
}
