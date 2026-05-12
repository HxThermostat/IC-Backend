import { Resolvers, QueryResolvers, MutationResolvers } from "../../schema";

export const resolver: Resolvers = {
  Location: {
    name: ({ name }) => name,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  // NOTE: The renameLocation mutation can be found in renameResolver.ts
};
