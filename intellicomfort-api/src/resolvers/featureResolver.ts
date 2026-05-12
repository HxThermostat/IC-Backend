import { Resolvers, QueryResolvers, MutationResolvers } from "../schema";

export const resolver: Resolvers = {
  FeatureMap: {
    schedule: () => null,
  },
};

export const queryResolver: QueryResolvers = {
  // This value doesn't actually matter, it just can't be null
  features: () => ({}),
};

export const mutationResolver: MutationResolvers = {};
