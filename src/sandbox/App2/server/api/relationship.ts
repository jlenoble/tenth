import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Op } from "sequelize";

import {
  APIContext,
  ItemId,
  UserId,
  Args,
  RelatedItem,
  ItemWithRelatedItems,
} from "../../types";

import { Store, Item, Relationship } from "../db";

type RelationshipSelector =
  | { relatedToId: ItemId }
  | { relationId: ItemId }
  | { relatedId: ItemId };

export class RelationshipAPI<
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

  async initialize(config: DataSourceConfig<Context>): Promise<void> {
    this.context = config.context;
  }

  async createRelatedItem({
    relatedToId,
    relationId,
    title,
  }: Args["createRelatedItem"]): Promise<RelatedItem> {
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

    const relationship = await this.store.Relationship.create<Relationship>({
      relatedToId,
      relatedId: item.id,
      relationId,
    });

    return {
      item: item.values,
      relationship: relationship.values,
    };
  }

  async getAllRelatedItems({
    relatedToId,
    relationId,
  }: Args["itemWithRelatedItems"]): Promise<ItemWithRelatedItems> {
    const item = await this.store.Item.findOne<Item>({
      where: { id: relatedToId, userId: this.userId },
    });

    const relation = await this.store.Item.findOne<Item>({
      where: { id: relationId },
    });

    if (!item || !relation) {
      throw new ForbiddenError("failed to fetch");
    }

    const relationships = await this.store.Relationship.findAll<Relationship>({
      where: { relatedToId, relationId },
    });

    const ids = relationships.map(({ relatedId }) => relatedId);

    const items = await this.store.Item.findAll<Item>({
      where: { id: ids },
    });

    return {
      __typename: "ItemWithRelatedItems",
      relation,
      item,
      items,
      relationshipIds: relationships.map(({ id }) => id),
    };
  }

  async getRelationshipsForItem({
    id,
  }: Args["relationshipsForItem"]): Promise<Relationship[]> {
    const item = await this.store.Item.findOne<Item>({
      where: { id, userId: this.userId },
    });

    if (!item) {
      throw new ForbiddenError("failed to fetch");
    }

    const relationships = await this.store.Relationship.findAll<Relationship>({
      where: {
        [Op.or]: [{ relatedToId: id }, { relationId: id }, { relatedId: id }],
      },
    });

    return relationships;
  }

  async destroyRelationshipsForItem({
    id,
  }: Args["destroyItem"]): Promise<Relationship[]> {
    const relationships = await this.getRelationshipsForItem({ id });

    await this.store.Relationship.destroy({
      where: { id: relationships.map(({ id }) => id) },
    });

    return relationships;
  }

  async destroyRelationships(
    { ids }: Args["destroyRelationships"],
    userId: UserId
  ): Promise<Relationship[]> {
    if (userId === this.userId) {
      const relationships = await this.store.Relationship.findAll<Relationship>(
        {
          where: { id: ids },
        }
      );

      const n = await this.store.Relationship.destroy({
        where: { id: ids },
      });

      if (n !== relationships.length) {
        throw new ApolloError("failed to destroy");
      }

      return relationships;
    }

    return [];
  }
}
