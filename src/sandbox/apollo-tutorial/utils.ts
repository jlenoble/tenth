import {
  Sequelize,
  ModelCtor,
  Model,
  INTEGER,
  DATE,
  STRING,
  Op
} from "sequelize";

export type UserDataType = {
  id: {
    type: number;
    primaryKey: true;
    autoIncrement: true;
  };
  createdAt: Date;
  updatedAt: Date;
  email: string;
  token: string;
};

export type User = Model<UserDataType> & { dataValues: UserDataType };
export type Users = ModelCtor<User>;

export type TripDataType = {
  id: {
    type: number;
    primaryKey: true;
    autoIncrement: true;
  };
  createdAt: Date;
  updatedAt: Date;
  launchId: number;
  userId: number;
};

export type Trip = Model<TripDataType> & { dataValues: TripDataType };
export type Trips = ModelCtor<Trip>;

export type Store = {
  users: Users;
  trips: Trips;
};

// export const paginateResults = ({
//   after: cursor,
//   pageSize = 20,
//   results,
//   // can pass in a function to calculate an item's cursor
//   getCursor = () => null
// }) => {
//   if (pageSize < 1) return [];

//   if (!cursor) return results.slice(0, pageSize);
//   const cursorIndex = results.findIndex((item) => {
//     // if an item has a `cursor` on it, use that, otherwise try to generate one
//     let itemCursor = item.cursor ? item.cursor : getCursor(item);

//     // if there's still not a cursor, return false by default
//     return itemCursor ? cursor === itemCursor : false;
//   });

//   return cursorIndex >= 0
//     ? cursorIndex === results.length - 1 // don't let us overflow
//       ? []
//       : results.slice(
//           cursorIndex + 1,
//           Math.min(results.length, cursorIndex + 1 + pageSize)
//         )
//     : results.slice(0, pageSize);
// };

export const createStore = (): Store => {
  const operatorsAliases = {
    $in: Op.in
  };

  const db = new Sequelize("database", "username", "password", {
    dialect: "sqlite",
    storage: "./store.sqlite",
    operatorsAliases,
    logging: false
  });

  const users = db.define("user", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: DATE,
    updatedAt: DATE,
    email: STRING,
    token: STRING
  }) as Users;

  const trips = db.define("trip", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: DATE,
    updatedAt: DATE,
    launchId: INTEGER,
    userId: INTEGER
  }) as Trips;

  return { users, trips };
};
