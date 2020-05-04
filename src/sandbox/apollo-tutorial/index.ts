import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";

const typeDefs = importSchema("./schemas/schema");

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
