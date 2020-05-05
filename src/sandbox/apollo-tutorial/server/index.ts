import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import path from "path";
import { createStore, User } from "./utils";
import { resolvers } from "./resolvers";
import { LaunchAPI } from "../datasources/launch";
import { UserAPI } from "../datasources/user";
import isEmail from "isemail";

const typeDefs = importSchema(
  path.join(__dirname, "../schemas/schema.graphql")
);

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate<User>({ where: { email } });
    const user = users[0];

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
