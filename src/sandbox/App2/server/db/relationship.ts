import { Model, DataTypes } from "sequelize";
import { GQLRelationship, ItemId, RelationshipId } from "../../types";

export const relationshipDataType = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  relationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  relatedToId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

export class Relationship extends Model implements GQLRelationship {
  public get values(): GQLRelationship {
    return { ...this.get(), ids: this.ids } as GQLRelationship;
  }

  public get id(): RelationshipId {
    return this.get("id");
  }
  public set id(value: RelationshipId) {
    this.set("id", value);
  }

  public get ids(): ItemId[] {
    return [this.relatedToId, this.relationId, this.relatedId];
  }

  public get relatedToId(): ItemId {
    return this.get("relatedToId");
  }
  public set relatedToId(value: ItemId) {
    this.set("relatedToId", value);
  }

  public get relationId(): ItemId {
    return this.get("relationId");
  }
  public set relationId(value: ItemId) {
    this.set("relationId", value);
  }

  public get relatedId(): ItemId {
    return this.get("relatedId");
  }
  public set relatedId(value: ItemId) {
    this.set("relatedId", value);
  }

  public get createdAt(): Date {
    return this.get("createdAt");
  }
  public set createdAt(value: Date) {
    this.set("createdAt", value);
  }

  public get updatedAt(): Date {
    return this.get("updatedAt");
  }
  public set updatedAt(value: Date) {
    this.set("updatedAt", value);
  }
}
