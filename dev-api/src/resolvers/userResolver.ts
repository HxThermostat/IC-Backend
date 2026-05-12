import { Resolvers, QueryResolvers, MutationResolvers } from "../schema";

import { randSleep } from "../utils";

import { findUserById } from "../fixtures";

export const resolver: Resolvers = {
  User: {
    id: ({ id }) => id,
    email: ({ email }) => email,
  },
};

export const queryResolver: QueryResolvers = {
  me: async (_root, _args, { user }) => {
    if (!user) return null;

    await randSleep(100, 2000);

    return (await findUserById(user.id)) ?? null;
  },
};
export const mutationResolver: MutationResolvers = {};
