import { AuthenticationError } from "apollo-server-express";

import { writeMetadata } from "ayla-client";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  TemperatureUnit,
  ChangeTemperatureUnitFeature,
} from "../../schema";

import { decodeTmpMode, isDevice, setMetadata } from "../../intellicomfort";

export const resolver: Resolvers = {
  FeatureMap: {
    changeTemperatureUnit: () => ChangeTemperatureUnitFeature.AppOnly,
  },
  Location: {
    temperatureUnit: ({ temperatureUnit }) => temperatureUnit,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  changeTemperatureUnit: async (
    _root,
    { input: { id, ...input } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");
    const location = await loaders.device.load(id);

    if (!isDevice(location)) return { __typename: "NotFound" };

    const tmpMode = decodeTmpMode(location.properties.TmpMode);

    let temperatureUnit: TemperatureUnit | undefined;
    if (tmpMode === input.temperatureUnit) {
      // Clear the unit when it's the same as the user's device so
      // that chances can sync between them
      temperatureUnit = undefined;
    } else {
      temperatureUnit = input.temperatureUnit;
    }

    await writeMetadata({
      dsn: id,
      ...setMetadata(location.metadata, "temperatureUnit", temperatureUnit),
      accessToken: user.accessToken,
    });

    loaders.device.clear(id).prime(id, location);

    return {
      __typename: "ChangeTemperatureUnitSuccess",
      location,
    };
  },
};
