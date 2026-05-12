import { AuthenticationError } from "apollo-server-errors";

import { renameDevice } from "ayla-client";

import {
  MutationResolvers,
  QueryResolvers,
  RenameFeature,
  Resolvers,
} from "../schema";

import { isDevice } from "../intellicomfort";

import { ResolverNotSupported } from "./errors";

export const resolver: Resolvers = {
  FeatureMap: {
    rename: () => [RenameFeature.Location],
  },
};

export const mutationResolver: MutationResolvers = {
  renameController: ResolverNotSupported(),
  renameLocation: async (_root, { input: { id, name } }, { loaders, user }) => {
    if (!user) throw new AuthenticationError("Authentication required");
    const location = await loaders.device.load(id);

    if (!isDevice(location)) {
      return {
        __typename: "NotFound",
      };
    }

    location.name = name;

    await renameDevice({
      dsn: id,
      name: location.name,
      accessToken: user.accessToken,
    });

    loaders.device.clear(id).prime(id, location);

    return {
      __typename: "RenameLocationSuccess",
      location,
    };
  },
};

export const queryResolver: QueryResolvers = {};
