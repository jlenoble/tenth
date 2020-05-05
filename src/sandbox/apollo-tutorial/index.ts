import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import path from "path";
import { createStore } from "./utils";
import { resolvers } from "./resolvers";
import { LaunchAPI } from "./datasources/launch";
import { UserAPI } from "./datasources/user";

const typeDefs = importSchema(path.join(__dirname, "schemas/schema.graphql"));

const store = createStore();

const server = new ApolloServer({
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
