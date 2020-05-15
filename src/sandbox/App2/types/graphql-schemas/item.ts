import { SequelizeDefaultAttributes } from "./sequelize";
import { UserId } from "./user";

export type ItemId = number;

export interface GQLItem extends SequelizeDefaultAttributes {
  id: ItemId;
  userId: UserId;
  title: string;
}
