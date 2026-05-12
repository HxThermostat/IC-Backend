import { AuthenticationError } from "apollo-server-express";

import {
  awaitDatapoint,
  registerDeviceWithRegToken,
  writeDatapoints,
} from "ayla-client";

import { isDevice } from "../../intellicomfort";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  ConnectFeature,
} from "../../schema";

export const resolver: Resolvers = {
  FeatureMap: {
    connect: () => ConnectFeature.AylaDisplay,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  connectAylaDisplay: async (_, { input: { token } }, { loaders, user }) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const accessToken = { accessToken: user.accessToken };

    try {
      const dsn = await registerDeviceWithRegToken({
        regToken: token,
        ...accessToken,
      });

      // When the device sees the Con2ACS property is set, it will
      // write the current sensor readings. This little manuever is a
      // trick to get a new device to sync as much data as possible
      // when it's connected for the first time.
      await writeDatapoints({
        datapoints: { dsn, propertyName: "Con2ACS", value: 1 },
        ...accessToken,
      });

      // Give the device a few seconds to acknowledge the Con2ACS
      // property change and write the relevant data (which we're )
      await awaitDatapoint({
        dsn,
        propertyName: "IdTmp1",
        ...accessToken,
      });

      const location = await loaders.device.clear(dsn).load(dsn);

      if (!isDevice(location)) return { __typename: "DeviceStateInvalid" };

      return {
        __typename: "ConnectAylaDisplaySuccess",
        location,
      };
    } catch {
      return {
        __typename: "TokenInvalid",
      };
    }
  },
};
