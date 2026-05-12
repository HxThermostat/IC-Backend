import { Resolvers, QueryResolvers, MutationResolvers } from "../schema";

export const resolver: Resolvers = {};

export const queryResolver: QueryResolvers = {
  manufacturer: () => ({
    support: {
      name: "Kraftful",
      email: "feedback@kraftful.com",
      phone: "(415) 234-0701",
    },
  }),
};

export const mutationResolver: MutationResolvers = {};
