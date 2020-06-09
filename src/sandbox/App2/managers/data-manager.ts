import {
  ItemId,
  RelationshipId,
  UserId,
  ClientItem,
  ClientRelationship,
} from "../types";

type CoreData = string | string[] | { [key: string]: CoreData } | CoreData[];

const coreData: CoreData = [
  {
    "Core Items": {
      Rel: ["⊃", "⊂", "→", "←"],
    },
  },
  "Me",
];

export type Items<Item extends ClientItem> = Map<ItemId, Item>;
export type Relationships<Relationship extends ClientRelationship> = Map<
  RelationshipId,
  Relationship
>;

export type Collector<
  Item extends ClientItem,
  Relationship extends ClientRelationship
> = {
  items: Items<Item>;
  relationships: Relationships<Relationship>;
  userId: UserId;
};

export enum RelationType {
  ltr,
  rtl,
  bidir,
}

export abstract class DataManager<
  Item extends ClientItem,
  Relationship extends ClientRelationship
> {
  protected coreData: CoreData = coreData;

  abstract async getItem(id: ItemId): Promise<Item>;
  abstract async getItems(ids: ItemId[]): Promise<Item[]>;
  abstract async getRelationshipsForItem(id: ItemId): Promise<Relationship[]>;
  abstract async getRelationshipsForItemAndRelation(
    itemId: ItemId,
    relationId: ItemId
  ): Promise<Relationship[]>;
  abstract async getRelationshipsForLeftItemAndRelation(
    relatedToId: ItemId,
    relationId: ItemId
  ): Promise<Relationship[]>;
  abstract async getRelationshipsForRightItemAndRelation(
    relatedId: ItemId,
    relationId: ItemId
  ): Promise<Relationship[]>;
  abstract async getUserId(item: Item): Promise<UserId>;

  abstract async bulkDestroyItems(items: Items<Item>): Promise<Item[]>;
  abstract async bulkDestroyRelationships(
    relationships: Relationships<Relationship>,
    userId: UserId
  ): Promise<Relationship[]>;

  abstract getCoreItemId(title: string): ItemId | undefined;

  async getRelationType(relationId: ItemId): Promise<RelationType> {
    return RelationType.ltr;
  }

  async filterStrongRelationships(
    relationships: Relationship[]
  ): Promise<Relationship[]> {
    const strongRelationships: Relationship[] = [];

    for (const relationship of relationships) {
      const {
        ids: [, relationId],
      } = relationship;

      if (relationId === (await this.getCoreItemId("⊃"))) {
        strongRelationships.push(relationship);
      }
    }

    return strongRelationships;
  }

  async collectStronglyRelatedDataForDestroyedItem(
    collector: Collector<Item, Relationship>,
    id: ItemId
  ): Promise<Item> {
    let item = collector.items.get(id);

    if (item) {
      // Already done
      if (!collector.userId) {
        collector.userId = await this.getUserId(item);
      }

      return item;
    }

    item = await this.getItem(id);

    if (!collector.userId) {
      collector.userId = await this.getUserId(item);
    } else {
      const userId = await this.getUserId(item);

      if (userId !== collector.userId) {
        throw new Error("forbidden");
      }
    }

    if (item) {
      collector.items.set(id, item);

      let relationships = await this.getRelationshipsForItem(id);

      // Remove already done
      relationships = relationships.filter(
        ({ id }) => !collector.relationships.has(id)
      );

      const strongRelationships = await this.filterStrongRelationships(
        relationships
      );

      for (const relationship of strongRelationships) {
        const {
          id: relationshipId,
          ids: [relatedToId, relationId, relatedId],
        } = relationship;

        // Don't handle twice if recursive call
        collector.relationships.set(relationshipId, relationship);

        if (id === relationId) {
          // Do nothing: Whether strong or not, only the relationship
          // needs to be destroyed
          continue;
        }

        const relationType = await this.getRelationType(relationId);

        switch (relationType) {
          case RelationType.ltr: {
            if (relatedToId === id) {
              await this.collectStronglyRelatedDataForDestroyedItem(
                collector,
                relatedId
              );
            }
            break;
          }

          case RelationType.rtl: {
            if (relatedId === id) {
              await this.collectStronglyRelatedDataForDestroyedItem(
                collector,
                relatedToId
              );
            }
            break;
          }

          case RelationType.bidir: {
            await this.collectStronglyRelatedDataForDestroyedItem(
              collector,
              id === relatedToId ? relatedId : relatedToId
            );
            break;
          }
        }
      }

      for (const relationship of relationships) {
        collector.relationships.set(relationship.id, relationship);
      }

      return item;
    }

    throw new Error("failed to destroy");
  }

  async getItemWithRelatedItems(
    relatedToId: ItemId,
    relationId: ItemId
  ): Promise<{
    relation: Item;
    item: Item;
    relationships: Relationship[];
    items: Item[];
  }> {
    const item = await this.getItem(relatedToId);
    const relation = await this.getItem(relationId);
    const relationType = await this.getRelationType(relationId);

    let relationships: Relationship[] = [];
    let ids: ItemId[] = [];

    switch (relationType) {
      case RelationType.ltr: {
        relationships = await this.getRelationshipsForLeftItemAndRelation(
          relatedToId,
          relationId
        );
        ids = relationships.map(({ ids: [, , relatedId] }) => relatedId);
        break;
      }

      case RelationType.rtl: {
        relationships = await this.getRelationshipsForRightItemAndRelation(
          relatedToId,
          relationId
        );
        ids = relationships.map(({ ids: [relatedToId] }) => relatedToId);
        break;
      }

      case RelationType.bidir: {
        relationships = await this.getRelationshipsForItemAndRelation(
          relatedToId,
          relationId
        );
        ids = relationships.map(({ ids: [relatedToId, , relatedId] }) =>
          relatedToId === item.id ? relatedId : relatedToId
        );
        break;
      }
    }

    const items: Item[] = await this.getItems(ids);

    return {
      relation,
      item,
      relationships,
      items,
    };
  }

  async destroyItem(
    id: ItemId
  ): Promise<{
    item: Item;
    items: Item[];
    relationships: Relationship[];
  }> {
    const collector: Collector<Item, Relationship> = {
      items: new Map(),
      relationships: new Map(),
      userId: 0,
    };

    const item = await this.collectStronglyRelatedDataForDestroyedItem(
      collector,
      id
    );

    if (!collector.userId) {
      throw new Error("user is not identified");
    }

    const items = await this.bulkDestroyItems(collector.items);
    const relationships = await this.bulkDestroyRelationships(
      collector.relationships,
      collector.userId
    );

    return { item, items, relationships };
  }
}
