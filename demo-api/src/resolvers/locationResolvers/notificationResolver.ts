import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

export const resolver: Resolvers = {
  FeatureMap: {
    notifications: () => null,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {};
