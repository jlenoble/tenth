import { DataSource, DataSourceConfig } from "apollo-datasource";
import {
  // MutationToCreateItemArgs,
  // MutationToUpdateItemArgs,
  // MutationToDestroyItemArgs,
  QueryToSubItemsArgs,
  APIContext,
  GQLItem,
} from "../../types";
import { Store, Item, Relation } from "../db";

export class RelationAPI<
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

  // async createRelation({
  //   containerId,
  //   itemId,
  // }: MutationToCreateItemArgs): Promise<GQLRelation | null> {
  //   const userId = this.context?.user?.id;

  //   if (!userId) {
  //     return null;
  //   }

  //   const item = await this.store.Item.create<Item>({ title, userId });
  //   return item.values;
  // }

  // async updateItem({
  //   id,
  //   ...args
  // }: MutationToUpdateItemArgs): Promise<GQLItem | null> {
  //   const userId = this.context?.user?.id;

  //   if (!userId) {
  //     return null;
  //   }

  //   let item = await this.store.Item.findOne<Item>({ where: { id, userId } });

  //   if (item) {
  //     item = await item.update(args);
  //     return item.values;
  //   } else {
  //     return null;
  //   }
  // }

  // async destroyItem({
  //   id,
  // }: MutationToDestroyItemArgs): Promise<GQLItem | null> {
  //   const userId = this.context?.user?.id;

  //   if (!userId) {
  //     return null;
  //   }

  //   const item = await this.store.Item.findOne<Item>({ where: { id, userId } });

  //   if (item) {
  //     await item.destroy();
  //     return item.values;
  //   } else {
  //     return null;
  //   }
  // }

  async getAllItems({ itemId1 }: QueryToSubItemsArgs): Promise<GQLItem[]> {
    const userId = this.context?.user?.id;

    if (!userId) {
      return [];
    }

    const item = await this.store.Item.findOne<Item>({
      where: { id: itemId1, userId },
    });

    if (!item) {
      return [];
    }

    const relations = await this.store.Relation.findAll<Relation>({
      where: { itemId1 },
    });

    return [];
  }

  // async getItemById({ id }: { id: number }): Promise<GQLItem | null> {
  //   const userId = this.context?.user?.id;

  //   if (!userId) {
  //     return null;
  //   }

  //   const item = await this.store.Item.findOne<Item>({ where: { id, userId } });
  //   return item ? item.values : null;
  // }
}
