import { Sequelize, ModelCtor } from "sequelize";
import { Item, itemDataType } from "./item";
import { User, userDataType } from "./user";

export type Store = {
  items: ModelCtor<Item>;
  users: ModelCtor<User>;
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

  User.init(userDataType, {
    sequelize,
    modelName: User.name,
    freezeTableName: true,
  });

  return { items: Item, users: User };
};
