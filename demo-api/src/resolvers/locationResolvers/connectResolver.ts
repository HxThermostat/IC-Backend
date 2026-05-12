import { Resolvers, QueryResolvers, MutationResolvers } from "../../schema";

export const resolver: Resolvers = {
  FeatureMap: {
    connect: () => null, // We'll want to add an Ayla_AP variant
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {};
