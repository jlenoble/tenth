import { Model, DataTypes } from "sequelize";
import { GQLItem, ItemId, UserId } from "../../types";

export const itemDataType = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: new DataTypes.TEXT(),
    allowNull: false,
  },
};

export class Item extends Model implements GQLItem {
  public get values(): GQLItem {
    return this.get() as GQLItem;
  }

  public get id(): ItemId {
    return this.get("id");
  }
  public set id(value: ItemId) {
    this.set("id", value);
  }

  public get userId(): UserId {
    return this.get("userId");
  }
  public set userId(value: UserId) {
    this.set("userId", value);
  }

  public get title(): string {
    return this.get("title");
  }
  public set title(value: string) {
    this.set("title", value);
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
