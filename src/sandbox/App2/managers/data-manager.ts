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
  destroyedItems: Items<Item>;
  destroyedRelationships: Relationships<Relationship>;
  relationshipsForItem: Map<ItemId, Relationship[]>;
  maybeInaccessibleItems: Items<Item>;
  connections: Map<ItemId, Set<ItemId>>;
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
  ): Promise<Map<RelationshipId, Relationship>> {
    const strongRelationships: Map<RelationshipId, Relationship> = new Map();

    for (const relationship of relationships) {
      const {
        ids: [, relationId],
      } = relationship;

      if (relationId === this.getCoreItemId("⊃")) {
        strongRelationships.set(relationship.id, relationship);
      }
    }

    return strongRelationships;
  }

  connect(
    minId: ItemId,
    maxId: ItemId,
    connections: Map<ItemId, Set<ItemId>>
  ): void {
    if (maxId === minId) {
      return;
    }

    if (maxId < minId) {
      const id = minId;
      minId = maxId;
      maxId = id;
    }

    let minSet = connections.get(minId);
    let maxSet = connections.get(maxId);
    console.log("!!!", minId, maxId, minSet, maxSet);

    if (!minSet) {
      minSet = new Set([minId]);
      connections.set(minId, minSet);
    }

    if (!maxSet) {
      maxSet = new Set([maxId]);
      connections.set(maxId, maxSet);
    }

    minSet.add(maxId);

    for (const id of minSet) {
      if (id < minId) {
        minId = id;
        const relSet = connections.get(id);
        if (relSet) {
          for (const id of relSet) {
            minSet.add(id);
          }
        }
      }
    }

    for (const id of maxSet) {
      if (id < minId) {
        minId = id;
      }
      minSet.add(id);
    }

    const newSet = new Set([minId]);

    for (const id of minSet) {
      connections.set(id, newSet);
    }

    connections.set(minId, minSet);
    console.log(minId, maxId, minSet);
  }

  async collectRelatedDataForItem(
    collector: Collector<Item, Relationship>,
    id: ItemId,
    willDestroy: boolean
  ): Promise<Item> {
    let item = collector.items.get(id);

    if (item) {
      // Already done
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

      if (willDestroy) {
        collector.destroyedItems.set(id, item);
        collector.maybeInaccessibleItems.delete(id);
      }

      let relationships = collector.relationshipsForItem.get(id);

      if (!relationships) {
        relationships = await this.getRelationshipsForItem(id);
        collector.relationshipsForItem.set(id, relationships);
      }

      // Remove already done
      relationships = relationships.filter(
        ({ id }) => !collector.relationships.has(id)
      );

      for (const {
        ids: [relatedToId, , relatedId],
      } of relationships) {
        this.connect(relatedToId, relatedId, collector.connections);
      }

      const strongRelationships = await this.filterStrongRelationships(
        relationships
      );

      for (const relationship of relationships) {
        const {
          id: relationshipId,
          ids: [relatedToId, relationId, relatedId],
        } = relationship;

        // Don't handle twice if recursive call
        collector.relationships.set(relationshipId, relationship);

        if (willDestroy) {
          collector.destroyedRelationships.set(relationshipId, relationship);
        }

        if (id === relationId) {
          // Do nothing: Whether strong or not, only the relationship
          // needs to be destroyed
          continue;
        }

        const isStrong = strongRelationships.has(relationshipId);
        const relationType = await this.getRelationType(relationId);
        const nextId = id === relatedToId ? relatedId : relatedToId;
        const willDestroyNext =
          willDestroy &&
          isStrong &&
          ((relationType === RelationType.ltr && nextId === relatedId) ||
            (relationType === RelationType.rtl && nextId === relatedToId) ||
            relationType === RelationType.bidir);

        const nextItem = await this.collectRelatedDataForItem(
          collector,
          nextId,
          willDestroyNext
        );

        if (
          willDestroy &&
          !willDestroyNext &&
          !collector.destroyedItems.has(nextId)
        ) {
          collector.maybeInaccessibleItems.set(nextId, nextItem);
        }
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
      destroyedItems: new Map(),
      destroyedRelationships: new Map(),
      relationshipsForItem: new Map(),
      maybeInaccessibleItems: new Map(),
      connections: new Map(),
      userId: 0,
    };
    const { destroyedItems, destroyedRelationships } = collector;

    const item = await this.collectRelatedDataForItem(collector, id, true);
    const userId = collector.userId;

    if (!userId) {
      throw new Error("user is not identified");
    }

    console.log(collector);

    const items = await this.bulkDestroyItems(destroyedItems);

    // if (collector.maybeInaccessibleItems.size) {
    //   const maybeLeftRelationships: Map<ItemId, Relationship[]> = new Map();

    //   for (const itemId of collector.maybeInaccessibleItems) {
    //     let relationships = collector.relationshipsForItem.get(itemId);

    //     if (relationships) {
    //       relationships = relationships.filter(
    //         ({ id }) => !collector.relationships.has(id)
    //       );

    //       if (relationships.length) {
    //         maybeLeftRelationships.set(itemId, relationships);
    //       }
    //     }
    //   }

    //   for (const itemId of maybeLeftRelationships) {
    //     collector.maybeInaccessibleItems;
    //   }

    //   console.log(
    //     collector.maybeInaccessibleItems,
    //     collector.relationshipsForItem,
    //     maybeLeftRelationships
    //   );
    // }

    const relationships = await this.bulkDestroyRelationships(
      destroyedRelationships,
      userId
    );

    return { item, items, relationships };
  }
}
