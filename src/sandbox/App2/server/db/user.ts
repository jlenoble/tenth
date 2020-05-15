import { Model, DataTypes } from "sequelize";
import { GQLUser, UserId } from "../../types";

export const userDataType = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
};

export class User extends Model implements GQLUser {
  public get values(): GQLUser {
    return this.get() as GQLUser;
  }

  public get id(): UserId {
    return this.get("id");
  }
  public set id(value: UserId) {
    this.set("id", value);
  }

  public get email(): string {
    return this.get("email");
  }
  public set email(value: string) {
    this.set("email", value);
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
