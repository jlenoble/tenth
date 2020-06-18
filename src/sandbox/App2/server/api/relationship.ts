import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Op } from "sequelize";

import { APIContext, UserId, Args } from "../../types";
import { Store, Item, Relationship } from "../db";

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
  }: Args["createRelatedItem"]): Promise<{
    item: Item;
    relationship: Relationship;
  }> {
    const userId = this.userId;

    const items = await this.store.Item.findAll<Item>({
      where: { id: [relatedToId, relationId], userId },
    });

    if (!items.length) {
      throw new ForbiddenError("failed to create");
    }

    const item = await this.store.Item.create<Item>({
      title,
      userId,
    });

    const relationship = await this.store.Relationship.create<Relationship>({
      relatedToId,
      relatedId: item.id,
      relationId,
    });

    return {
      item,
      relationship,
    };
  }

  async createRelationships(
    { ids }: Args["createRelationships"],
    userId: UserId
  ): Promise<Relationship[]> {
    if (userId === this.userId) {
      const relationships = await this.store.Relationship.findAll<Relationship>(
        {
          where: {
            [Op.or]: ids.map(([relatedToId, relationId, relatedId]) => ({
              relatedToId,
              relationId,
              relatedId,
            })),
          },
        }
      );

      if (relationships.length) {
        throw new ForbiddenError("failed to create");
      }

      relationships.length = 0;

      for (const [relatedToId, relationId, relatedId] of ids) {
        relationships.push(
          await this.store.Relationship.create<Relationship>({
            relatedToId,
            relatedId,
            relationId,
          })
        );
      }

      return relationships;
    }

    return [];
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

  async getRelationshipsForItemAndRelation({
    id,
    relationId,
  }: Args["relationshipsForItemAndRelation"]): Promise<Relationship[]> {
    const item = await this.store.Item.findOne<Item>({
      where: { id, userId: this.userId },
    });

    if (!item) {
      throw new ForbiddenError("failed to fetch");
    }

    const relationships = await this.store.Relationship.findAll<Relationship>({
      where: {
        [Op.or]: [
          { relatedToId: id, relationId },
          { relatedId: id, relationId },
        ],
      },
    });

    return relationships;
  }

  async getRelationshipsForLeftItemAndRelation({
    relatedToId,
    relationId,
  }: Args["relationshipsForLeftItemAndRelation"]): Promise<Relationship[]> {
    const item = await this.store.Item.findOne<Item>({
      where: { id: relatedToId, userId: this.userId },
    });

    if (!item) {
      throw new ForbiddenError("failed to fetch");
    }

    const relationships = await this.store.Relationship.findAll<Relationship>({
      where: { relatedToId, relationId },
    });

    return relationships;
  }

  async getRelationshipsForRightItemAndRelation({
    relatedId,
    relationId,
  }: Args["relationshipsForRightItemAndRelation"]): Promise<Relationship[]> {
    const item = await this.store.Item.findOne<Item>({
      where: { id: relatedId, userId: this.userId },
    });

    if (!item) {
      throw new ForbiddenError("failed to fetch");
    }

    const relationships = await this.store.Relationship.findAll<Relationship>({
      where: { relatedId, relationId },
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

  async updateRelationship({
    id,
    ...args
  }: Args["updateRelationship"]): Promise<Relationship> {
    const { ids } = args;
    const [relatedToId, relationId, relatedId] = ids;
    let relationship = await this.store.Relationship.findOne<Relationship>({
      where: { id },
    });

    const items = await this.store.Item.findAll<Item>({
      where: { id: ids, userId: this.userId },
    });

    if (relationship && items.length === 3) {
      relationship = await relationship.update({
        ...args,
        relatedToId,
        relationId,
        relatedId,
      });

      return relationship;
    }

    throw new ForbiddenError("failed to update");
  }
}
