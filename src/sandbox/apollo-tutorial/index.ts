import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import { createStore } from "./utils";
import { LaunchAPI } from "./datasources/launch";
import { UserAPI } from "./datasources/user";

const typeDefs = importSchema("./schemas/schema");

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
