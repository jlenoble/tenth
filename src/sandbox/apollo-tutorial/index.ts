import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schemas/schema";

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
