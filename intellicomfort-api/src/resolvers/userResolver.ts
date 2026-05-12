import { profile } from "ayla-client";
import { Resolvers, QueryResolvers, MutationResolvers } from "../schema";

export const resolver: Resolvers = {
  User: {
    id: ({ id }) => id,
    email: async ({ accessToken }) => (await profile({ accessToken })).email,
  },
};

export const queryResolver: QueryResolvers = {
  me: (_root, _args, { user }) => user,
};

export const mutationResolver: MutationResolvers = {};
