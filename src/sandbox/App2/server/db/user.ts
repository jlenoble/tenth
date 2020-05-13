import { Model, DataTypes } from "sequelize";

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

export class User extends Model {
  public id!: number;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
