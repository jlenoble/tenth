import { SequelizeDefaultAttributes } from "./sequelize";
import { UserId } from "./ids";

export interface GQLUser extends SequelizeDefaultAttributes {
  id: UserId;
  email: string;
}
