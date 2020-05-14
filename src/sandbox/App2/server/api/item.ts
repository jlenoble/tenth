import { DataSource, DataSourceConfig } from "apollo-datasource";
import {
  MutationToCreateItemArgs,
  MutationToUpdateItemArgs,
  MutationToDestroyItemArgs,
  APIContext,
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

  async createItem({ title }: MutationToCreateItemArgs): Promise<Item | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    return this.store.Item.create<Item>({ title, userId });
  }

  async updateItem({
    id,
    ...args
  }: MutationToUpdateItemArgs): Promise<Item | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    const item = await this.store.Item.findOne<Item>({ where: { id, userId } });

    if (item) {
      return item.update(args);
    } else {
      return null;
    }
  }

  async destroyItem({ id }: MutationToDestroyItemArgs): Promise<void | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    const item = await this.store.Item.findOne<Item>({ where: { id, userId } });

    if (item) {
      return item.destroy();
    } else {
      return null;
    }
  }

  async getAllItems(): Promise<Item[]> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return [];
    }

    return this.store.Item.findAll<Item>({ where: { userId } });
  }

  async getItemById({ id }: { id: number }): Promise<Item | null> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return null;
    }

    return this.store.Item.findOne<Item>({
      where: { id, userId },
    });
  }
}
