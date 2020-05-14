import { DataSource, DataSourceConfig } from "apollo-datasource";
import { GQLItem } from "../../__types__";
import { Store, Item } from "../db";
import { APIContext } from "./context";

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

  async createItem({
    title,
    userId,
  }: Omit<GQLItem, "id">): Promise<Item | null> {
    if (userId !== this.context?.user?.id) {
      return null;
    }

    const item = await this.store.Item.create<Item>({ title, userId });
    return item;
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
