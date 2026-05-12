import { AuthenticationError } from "apollo-server-express";

import { addController, addLocation, updateLocation } from "../../fixtures";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  ConnectFeature,
  ConnectionStatus,
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

    if (token.length !== 6) return { __typename: "TokenInvalid" };
    // This is just a way for us to simulate a DeviceStateInvalid scenario
    // by entering this magic word in the mobile app.
    if (token.toLowerCase() === "broken") return { __typename: "DeviceStateInvalid" };

    const zoning = token.includes("z");

    const { id: locationId } = await addLocation({
      name: "Home",
      temperatureUnit: "F",
      userId: user.id,
      connectionStatus: ConnectionStatus.Online,
      zoning,
    });

    const controllerCount = zoning ? 3 : 1;
    const controllerIds: string[] = [];

    for (let i = 0; i < controllerCount; i++) {
      const { id } = await addController({
        name: `Smart Thermostat${zoning ? ` Zone ${i + 1}` : ""}`,
        userId: user.id,
        locationId,
        awaySetpointLower: 10,
        awaySetpointTarget: 17,
        awaySetpointUpper: 21,
        holdLengthType: "Indefinite",
        humidityNotificationMax: 65,
        humidityNotificationMin: 15,
        mode: "HEAT",
        setpointLower: 15,
        setpointTarget: 18,
        setpointUpper: 26,
        temperatureNotificationMax: 30.5,
        temperatureNotificationMin: 15.5,
      });

      controllerIds.push(id);
    }

    const location = updateLocation(locationId, {
      controllerIds,
    });

    loaders.controllers.clearAll();
    loaders.locations.clearAll();

    return {
      __typename: "ConnectAylaDisplaySuccess",
      location,
    };
  },
};
