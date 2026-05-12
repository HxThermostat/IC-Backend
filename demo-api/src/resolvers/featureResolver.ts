import { Resolvers, QueryResolvers, MutationResolvers } from "../schema";

export const resolver: Resolvers = {
  // This value doesn't actually matter, it just can't be null
  FeatureMap: {},
};

export const queryResolver: QueryResolvers = {
  // This value doesn't actually matter, it just can't be null
  features: () => ({}),
};

export const mutationResolver: MutationResolvers = {};
