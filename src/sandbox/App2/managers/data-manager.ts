import {
  ItemId,
  RelationshipId,
  GQLItem,
  GQLRelationship,
  UserId,
} from "../types";

export type Items = Map<ItemId, GQLItem>;
export type Relationships = Map<RelationshipId, GQLRelationship>;

export type Collector = {
  items: Items;
  relationships: Relationships;
};

export enum RelationType {
  ltr,
  rtl,
  bidir,
}

export abstract class DataManager {
  abstract async getItem(id: ItemId): Promise<GQLItem>;
  abstract async getItems(ids: ItemId[]): Promise<GQLItem[]>;
  abstract async getRelationshipsForItem(
    id: ItemId
  ): Promise<GQLRelationship[]>;
  abstract async getRelationshipsForItemAndRelation(
    itemId: ItemId,
    relationId: ItemId
  ): Promise<GQLRelationship[]>;
  abstract async getRelationshipsForLeftItemAndRelation(
    relatedToId: ItemId,
    relationId: ItemId
  ): Promise<GQLRelationship[]>;
  abstract async getRelationshipsForRightItemAndRelation(
    relatedId: ItemId,
    relationId: ItemId
  ): Promise<GQLRelationship[]>;
  abstract async getRelationType(relationId: ItemId): Promise<RelationType>;

  abstract async filterStrongRelationships(
    relationships: GQLRelationship[]
  ): Promise<GQLRelationship[]>;

  abstract async bulkDestroyItems(items: Items): Promise<void>;
  abstract async bulkDestroyRelationships(
    relationships: Relationships,
    userId: UserId
  ): Promise<void>;

  async collectStronglyRelatedDataForDestroyedItem(
    collector: Collector,
    id: ItemId
  ): Promise<GQLItem> {
    let item = collector.items.get(id);

    if (item) {
      // Already done
      return item;
    }

    item = await this.getItem(id);

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
    relation: GQLItem;
    item: GQLItem;
    relationships: GQLRelationship[];
    items: GQLItem[];
  }> {
    const item = await this.getItem(relatedToId);
    const relation = await this.getItem(relationId);
    const relationType = await this.getRelationType(relationId);

    let relationships: GQLRelationship[] = [];
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

    const items: GQLItem[] = await this.getItems(ids);

    return {
      relation,
      item,
      relationships,
      items,
    };
  }

  async destroyItem(id: ItemId): Promise<GQLItem> {
    const collector: Collector = {
      items: new Map(),
      relationships: new Map(),
    };

    const item = await this.collectStronglyRelatedDataForDestroyedItem(
      collector,
      id
    );

    await this.bulkDestroyItems(collector.items);
    await this.bulkDestroyRelationships(collector.relationships, item.userId);

    return item;
  }
}