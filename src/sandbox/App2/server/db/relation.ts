import { Model, DataTypes } from "sequelize";
import { GQLRelation, ItemId, RelationId } from "../../types";

export const relationDataType = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  itemId1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  itemId2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

export class Relation extends Model implements GQLRelation {
  public get values(): GQLRelation {
    return this.get() as GQLRelation;
  }

  public get id(): RelationId {
    return this.get("id");
  }
  public set id(value: RelationId) {
    this.set("id", value);
  }

  public get type(): string {
    return this.get("type");
  }
  public set type(value: string) {
    this.set("type", value);
  }

  public get itemId1(): ItemId {
    return this.get("itemId1");
  }
  public set itemId1(value: ItemId) {
    this.set("itemId1", value);
  }

  public get itemId2(): ItemId {
    return this.get("itemId2");
  }
  public set itemId2(value: ItemId) {
    this.set("itemId2", value);
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
