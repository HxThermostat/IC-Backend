import { isAuthenticationError } from "ayla-client";

import { isDevice } from "../../hx";

import {
  FanMode,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  TemperaturePresetsFeature,
  TemperaturePresetMapper,
} from "../../schema";

import { propagateErrors } from "../../utils";

export const resolver: Resolvers = {
  FeatureMap: {
    temperaturePresets: () => [TemperaturePresetsFeature.BuiltIn],
  },
  TemperaturePreset: {
    id: ({ id }) => id,
    name: ({ name }) => name,
    slot: ({ slot }) => slot,
    setpoint: async ({ dsn, setpoint }, _, { loaders }) => {
      const device = await loaders.device.load(dsn);

      if (!device) throw new Error();

      return {
        ...device,
        lower: { key: "heat", value: setpoint.lower },
        upper: { key: "cool", value: setpoint.upper },
      };
    },
    fanMode: () => FanMode.Auto,
    removable: () => false,
  },
  Location: {
    temperaturePresets: ({ temperaturePresets }) => temperaturePresets,
  },
};

export const mutationResolver: MutationResolvers = {};

export const queryResolver: QueryResolvers = {
  temperaturePreset: (_, { id }, { loaders }) =>
    loaders.temperaturePreset.load(id),
  temperaturePresets: async (_, __, { loaders, user }) => {
    if (!user) return [];
    const dsns = await loaders.devices.load(user.id);

    const presets: TemperaturePresetMapper[] = [];

    const devices = propagateErrors(
      await loaders.device.loadMany(dsns),
      isAuthenticationError
    );

    devices.forEach((device) => {
      if (isDevice(device)) {
        device.temperaturePresets.forEach((preset) => {
          presets.push(preset);
        });
      }
    });

    return presets;
  },
};
