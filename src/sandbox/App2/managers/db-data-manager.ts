import {
  DataManager,
  RelationType,
  Items,
  Relationships,
} from "./data-manager";
import { APIMap, ItemId, GQLItem, GQLRelationship, UserId } from "../types";

export class DbDataManager extends DataManager {
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

  async getRelationshipsForItem(id: ItemId): Promise<GQLRelationship[]> {
    return this.dataSources.relationshipAPI.getRelationshipsForItem({ id });
  }

  async getRelationType(relationId: ItemId): Promise<RelationType> {
    return RelationType.ltr;
  }

  async filterStrongRelationships(
    relationships: GQLRelationship[]
  ): Promise<GQLRelationship[]> {
    return relationships.filter(({ ids: [, relationId] }) => relationId === 2);
  }

  async bulkDestroyItems(ids: Items): Promise<void> {
    await this.dataSources.itemAPI.destroyItems({
      ids: Array.from(ids.keys()),
    });
  }

  async bulkDestroyRelationships(
    ids: Relationships,
    userId: UserId
  ): Promise<void> {
    await this.dataSources.relationshipAPI.destroyRelationships(
      {
        ids: Array.from(ids.keys()),
      },
      userId
    );
  }
}
