import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import path from "path";
import { createStore, User } from "./db";
import { APIMap, UserAPI } from "./datasources";
import isEmail from "isemail";

const typeDefs = importSchema(
  path.join(__dirname, "../graphql-schemas/index.graphql")
);

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }): Promise<{ user: User | null }> => {
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) return { user: null };
    const users = await store.users.findOrCreate<User>({ where: { email } });
    const user = users[0] || null;
    return { user };
  },

  typeDefs,

  dataSources: (): APIMap => ({
    userAPI: new UserAPI({ store }),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
