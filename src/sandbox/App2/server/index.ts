import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import path from "path";
import { createStore, User } from "./db";
import { ItemAPI, RelationAPI, UserAPI } from "./api";
import isEmail from "isemail";
import { resolvers } from "../graphql-resolvers";
import { APIMap } from "../types";

const typeDefs = importSchema(
  path.join(__dirname, "../graphql-schemas/server/index.graphql")
);

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }): Promise<{ user: User | null }> => {
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) return { user: null };
    const users = await store.User.findOrCreate<User>({ where: { email } });
    const user = users[0] || null;
    return { user };
  },

  typeDefs,
  resolvers,

  dataSources: (): APIMap => ({
    itemAPI: new ItemAPI({ store }),
    relationAPI: new RelationAPI({ store }),
    userAPI: new UserAPI({ store }),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
