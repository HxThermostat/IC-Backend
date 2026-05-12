import { makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";
import { GraphQLSchema } from "graphql";

import { typeResolvers, queryResolvers, mutationResolvers } from "../resolvers";

import loadSchema, { Resolvers } from "../schema";

const Query: Resolvers["Query"] = {};
queryResolvers.map((resolver) => {
  merge(Query, resolver);
});

const Mutation: Resolvers["Mutation"] = {};
mutationResolvers.map((resolver) => {
  merge(Mutation, resolver);
});

const TypeResolvers: Resolvers = {};
typeResolvers.map((resolver) => {
  merge(TypeResolvers, resolver);
});

const resolvers: Resolvers = {
  Query,
  Mutation,
  ...TypeResolvers,
};

export default async function buildSchema(): Promise<GraphQLSchema> {
  const typeDefs = await loadSchema();

  return makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {},
    resolverValidationOptions: { requireResolversForResolveType: false },
  });
}
