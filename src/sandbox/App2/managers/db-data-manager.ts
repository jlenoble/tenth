import { DataManager, Items, Relationships } from "./data-manager";
import { APIMap, ItemId, GQLItem, GQLRelationship, UserId } from "../types";

export class DbDataManager extends DataManager<GQLItem, GQLRelationship> {
  private dataSources: APIMap;

  constructor(dataSources: APIMap) {
    super();
    this.dataSources = dataSources;
  }

  async getItem(id: ItemId): Promise<GQLItem> {
    const item = await this.dataSources.itemAPI.getItemById({ id });
    if (item) {
      return item;
    }
    throw new Error("server error");
  }

  async getItems(ids: ItemId[]): Promise<GQLItem[]> {
    const items = await this.dataSources.itemAPI.getItemsById({ ids });
    return items;
  }

  async getRelationshipsForItem(id: ItemId): Promise<GQLRelationship[]> {
    return this.dataSources.relationshipAPI.getRelationshipsForItem({ id });
  }

  async getRelationshipsForItemAndRelation(
    id: ItemId,
    relationId: ItemId
  ): Promise<GQLRelationship[]> {
    return this.dataSources.relationshipAPI.getRelationshipsForItemAndRelation({
      id,
      relationId,
    });
  }

  async getRelationshipsForLeftItemAndRelation(
    relatedToId: ItemId,
    relationId: ItemId
  ): Promise<GQLRelationship[]> {
    return this.dataSources.relationshipAPI.getRelationshipsForLeftItemAndRelation(
      { relatedToId, relationId }
    );
  }

  async getRelationshipsForRightItemAndRelation(
    relatedId: ItemId,
    relationId: ItemId
  ): Promise<GQLRelationship[]> {
    return this.dataSources.relationshipAPI.getRelationshipsForRightItemAndRelation(
      {
        relatedId,
        relationId,
      }
    );
  }

  getUserId(item: GQLItem): Promise<UserId> {
    return Promise.resolve(item.userId);
  }

  async bulkDestroyItems(items: Items<GQLItem>): Promise<GQLItem[]> {
    return await this.dataSources.itemAPI.destroyItems({
      ids: Array.from(items.keys()),
    });
  }

  async bulkDestroyRelationships(
    relationships: Relationships<GQLRelationship>,
    userId: UserId
  ): Promise<GQLRelationship[]> {
    return await this.dataSources.relationshipAPI.destroyRelationships(
      {
        ids: Array.from(relationships.keys()),
      },
      userId
    );
  }

  async getCoreItemId(title: string): Promise<ItemId> {
    const item = await this.dataSources.itemAPI.getCoreItemByTitle({ title });
    if (item) {
      return item.id;
    }
    throw new Error("server error");
  }
}
