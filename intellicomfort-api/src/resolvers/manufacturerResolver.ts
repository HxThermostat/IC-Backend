import { Resolvers, QueryResolvers, MutationResolvers } from "../schema";

export const resolver: Resolvers = {};

export const queryResolver: QueryResolvers = {
  manufacturer: () => ({
    support: {
      name: "Homeowner Support",
      email: "cg-upgconsumerrelations@jci.com",
      phone: "877-874-7378",
    },
  }),
};

export const mutationResolver: MutationResolvers = {};
