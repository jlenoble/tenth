import { GQLResolver } from "../types";
import { queryResolvers } from "./query";
import { mutationResolvers } from "./mutation";

export const resolvers: GQLResolver = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

export default resolvers;
