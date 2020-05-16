import { Sequelize, ModelCtor } from "sequelize";
import { Item, itemDataType } from "./item";
import { Relation, relationDataType } from "./relation";
import { User, userDataType } from "./user";

export type Store = {
  Item: ModelCtor<Item>;
  Relation: ModelCtor<Relation>;
  User: ModelCtor<User>;
};

export const createStore = (): Store => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./store.sqlite",
  });

  Item.init(itemDataType, {
    sequelize,
    modelName: Item.name,
    freezeTableName: true,
  });

  Relation.init(relationDataType, {
    sequelize,
    modelName: Relation.name,
    freezeTableName: true,
  });

  User.init(userDataType, {
    sequelize,
    modelName: User.name,
    freezeTableName: true,
  });

  return { Item, Relation, User };
};
