import { SequelizeDefaultAttributes } from "./sequelize";
import { ItemId, UserId } from "./ids";

export interface GQLItem extends SequelizeDefaultAttributes {
  id: ItemId;
  userId: UserId;
  title: string;
}
