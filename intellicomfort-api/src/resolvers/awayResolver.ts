import { AuthenticationError } from "apollo-server-express";

import { writeDatapoints } from "ayla-client";

import {
  AwayFeature,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  ResolversTypes,
} from "../schema";

import {
  COOL_MAX,
  decodeSysStg,
  decodeVacOvr,
  encodeVacOvr,
  HEAT_MAX,
  isDevice,
  setProperty,
} from "../intellicomfort";

import { cToF } from "../utils";

export const resolver: Resolvers = {
  Controller: {
    away: () => null,
  },
  FeatureMap: {
    away: () => [AwayFeature.AwayLocation],
  },
  Location: {
    away: ({ properties, temperatureUnit }) => {
      const { SysStg, VacOvr } = properties;

      const { coolEnabled, heatEnabled } = decodeSysStg(SysStg);

      const { enabled: active, coolSetpoint, heatSetpoint } = decodeVacOvr(
        VacOvr
      );

      let setpoint: ResolversTypes["Setpoint"];

      if (coolEnabled && heatEnabled) {
        setpoint = {
          lower: { key: "heat", value: heatSetpoint, temperatureUnit },
          upper: { key: "cool", value: coolSetpoint, temperatureUnit },
          temperatureUnit,
        };
      } else if (heatEnabled) {
        setpoint = { key: "heat", value: heatSetpoint, temperatureUnit };
      } else if (coolEnabled) {
        setpoint = { key: "cool", value: coolSetpoint, temperatureUnit };
      } else {
        throw new Error("Could not find value for Setpoint");
      }

      return {
        setpoint,
        active,
      };
    },
  },
};

export const mutationResolver: MutationResolvers = {
  changeControllerAwaySetpoint: () => ({ __typename: "NotSupported" }),
  changeLocationAwaySetpoint: async (
    _,
    { input: { id, single, dual } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");
    const location = await loaders.device.load(id);

    if (!isDevice(location)) return { __typename: "NotFound" };

    const { heatEnabled, coolEnabled } = decodeSysStg(
      location.properties.SysStg
    );

    const { VacOvr } = location.properties;

    if (heatEnabled && coolEnabled) {
      // Dual
      if (dual == null) return { __typename: "NotSupported" };

      await writeDatapoints({
        datapoints: {
          dsn: id,
          ...setProperty(
            location.properties,
            "VacOvr",
            encodeVacOvr({
              ...decodeVacOvr(VacOvr),
              base: VacOvr,
              heatSetpoint: Math.round(cToF(dual.lower)),
              coolSetpoint: Math.round(cToF(dual.upper)),
            })
          ),
        },
        accessToken: user.accessToken,
      });
    } else if (heatEnabled || coolEnabled) {
      // Single
      if (single == null) return { __typename: "NotSupported" };

      await writeDatapoints({
        datapoints: {
          dsn: id,
          ...setProperty(
            location.properties,
            "VacOvr",
            encodeVacOvr({
              ...decodeVacOvr(VacOvr),
              base: VacOvr,
              [heatEnabled ? "heatSetpoint" : "coolSetpoint"]: Math.round(
                cToF(single.target)
              ),
              [heatEnabled ? "coolSetpoint" : "heatSetpoint"]: heatEnabled
                ? COOL_MAX
                : HEAT_MAX,
            })
          ),
        },
        accessToken: user.accessToken,
      });
    } else {
      return { __typename: "NotSupported" };
    }

    loaders.device.clear(id).prime(id, location);

    return {
      __typename: "ChangeLocationAwaySetpointSuccess",
      location,
    };
  },
  toggleControllerAway: () => ({ __typename: "NotSupported" }),
  toggleLocationAway: async (
    _,
    { input: { id, active } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");
    const location = await loaders.device.load(id);

    if (!isDevice(location)) return { __typename: "NotFound" };

    const { VacOvr } = location.properties;

    await writeDatapoints({
      datapoints: {
        dsn: id,
        ...setProperty(
          location.properties,
          "VacOvr",
          encodeVacOvr({
            ...decodeVacOvr(VacOvr),
            base: VacOvr,
            enabled: active,
          })
        ),
      },
      accessToken: user.accessToken,
    });

    loaders.device.clear(id).prime(id, location);

    return {
      __typename: "ToggleLocationAwaySuccess",
      location,
    };
  },
};

export const queryResolver: QueryResolvers = {};
