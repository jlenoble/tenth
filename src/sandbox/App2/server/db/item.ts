import { Model, DataTypes } from "sequelize";

export const itemDataType = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: new DataTypes.TEXT(),
    allowNull: false,
  },
};

export class Item extends Model {
  public id!: number;
  public title!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
