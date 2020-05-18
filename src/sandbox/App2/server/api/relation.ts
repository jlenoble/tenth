import { AuthenticationError, ForbiddenError } from "apollo-server";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Op } from "sequelize";

import { APIContext, GQLItem, UserId } from "../../types";
import { Store, Item, Relation } from "../db";

import {
  ItemWithRelatedItems,
  QueryItemWithRelatedItemsArgs,
  MutationCreateRelatedItemArgs,
  MutationDestroyItemArgs,
} from "../../__generated__";

export class RelationAPI<
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

  async createItem({
    relatedToId,
    relationType,
    title,
  }: MutationCreateRelatedItemArgs): Promise<GQLItem> {
    const userId = this.userId;

    let item = await this.store.Item.findOne<Item>({
      where: { id: relatedToId, userId },
    });

    if (!item) {
      throw new ForbiddenError("failed to create");
    }

    item = await this.store.Item.create<Item>({
      title,
      userId,
    });

    await this.store.Relation.create<Relation>({
      itemId1: relatedToId,
      itemId2: item.id,
      type: relationType,
    });

    return item.values;
  }

  async destroyRelationsForItem({
    id,
  }: MutationDestroyItemArgs): Promise<number> {
    return this.store.Relation.destroy({
      where: {
        [Op.or]: [{ itemId1: id }, { itemId2: id }],
      },
    });
  }

  async getAllItems({
    relatedToId,
    relationType,
  }: QueryItemWithRelatedItemsArgs): Promise<ItemWithRelatedItems> {
    const item = await this.store.Item.findOne<Item>({
      where: { id: relatedToId, userId: this.userId },
    });

    if (!item) {
      throw new ForbiddenError("failed to fetch");
    }

    const relations = await this.store.Relation.findAll<Relation>({
      where: { itemId1: relatedToId, type: relationType },
    });

    const ids = relations.map(({ itemId2 }) => itemId2);

    const items = await this.store.Item.findAll<Item>({
      where: { id: ids },
    });

    return {
      relationType,
      item,
      items,
    };
  }
}
