import { AuthenticationError, ForbiddenError } from "apollo-server";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Op } from "sequelize";

import {
  APIContext,
  UserId,
  Args,
  ItemWithRelation,
  ItemWithRelatedItems,
} from "../../types";

import { Store, Item, Relation } from "../db";

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

  async createRelatedItem({
    relatedToId,
    relationType,
    title,
  }: Args["createRelatedItem"]): Promise<ItemWithRelation> {
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

    const relation = await this.store.Relation.create<Relation>({
      itemId1: relatedToId,
      itemId2: item.id,
      type: relationType,
    });

    return { item: item.values, relation: relation.values };
  }

  async getAllRelatedItems({
    relatedToId,
    relationType,
  }: Args["itemWithRelatedItems"]): Promise<ItemWithRelatedItems> {
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
      __typename: "ItemWithRelatedItems",
      relationType,
      item,
      items,
      relations: relations.map(({ id }) => id),
    };
  }

  async destroyRelationsForItem(
    { id }: Args["destroyItem"],
    userId: UserId
  ): Promise<number> {
    if (userId === this.userId) {
      return this.store.Relation.destroy({
        where: {
          [Op.or]: [{ itemId1: id }, { itemId2: id }],
        },
      });
    }

    return 0;
  }
}
