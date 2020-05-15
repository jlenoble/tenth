import { SequelizeDefaultAttributes } from "./sequelize";

export type UserId = number;

export interface GQLUser extends SequelizeDefaultAttributes {
  id: UserId;
  email: string;
}
