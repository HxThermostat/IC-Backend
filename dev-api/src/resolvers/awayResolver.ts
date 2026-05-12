import {
  AwayFeature,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "../schema";

import { updateController, ControllerRecord } from "../fixtures";

import { buildSetpointConstraints } from "./controllerResolvers/setpointResolver";

const enabled = [AwayFeature.AwayLocation, AwayFeature.AwayController];

export const resolver: Resolvers = {
  Controller: {
    away: async (controller, _, { loaders }) => {
      if (!enabled.includes(AwayFeature.AwayController)) return null;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const location = (await loaders.location.load(controller.locationId))!;

      const { max, min, minInterval, step } = buildSetpointConstraints()[
        location.temperatureUnit
      ];

      return {
        __typename: "Away",
        active: controller.awayActive,
        setpoint:
          controller.setpointType === "SingleSetpoint"
            ? {
                __typename: "SingleSetpoint",
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: controller.awaySetpointTarget!,
                min,
                max,
                step,
              }
            : {
                __typename: "DualSetpoint",
                lower: {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  value: controller.awaySetpointLower!,
                  min,
                  max: max - minInterval,
                  step,
                },
                upper: {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  value: controller.awaySetpointUpper!,
                  min: min + minInterval,
                  max,
                  step,
                },
                minInterval,
              },
      };
    },
  },
  FeatureMap: {
    away: () => enabled,
  },
  Location: {
    away: async (location, _, { loaders }) => {
      if (!enabled.includes(AwayFeature.AwayLocation)) return null;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const controller = (await loaders.controller.load(
        location.controllerIds[0]
      ))!;

      const { max, min, minInterval, step } = buildSetpointConstraints()[
        location.temperatureUnit
      ];

      return {
        __typename: "Away",
        active: controller.awayActive,
        setpoint:
          controller.setpointType === "SingleSetpoint"
            ? {
                __typename: "SingleSetpoint",
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: controller.awaySetpointTarget!,
                min,
                max,
                step,
              }
            : {
                __typename: "DualSetpoint",
                lower: {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  value: controller.awaySetpointLower!,
                  min,
                  max: max - minInterval,
                  step,
                },
                upper: {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  value: controller.awaySetpointUpper!,
                  min: min + minInterval,
                  max,
                  step,
                },
                minInterval,
              },
      };
    },
  },
};

export const mutationResolver: MutationResolvers = {
  changeControllerAwaySetpoint: async (
    _,
    { input: { id, single, dual } },
    { loaders, user }
  ) => {
    if (!enabled.includes(AwayFeature.AwayController))
      return { __typename: "NotSupported" };

    const controller = await loaders.controller.load(id);

    if (!controller) return { __typename: "NotFound" };

    if (!controller.supportsAway) return { __typename: "NotSupported" };

    let change: Partial<ControllerRecord> = {};
    switch (controller.setpointType) {
      case "SingleSetpoint": {
        if (single == null) return { __typename: "NotSupported" };
        change = {
          awaySetpointTarget: single.target,
        };
        break;
      }
      case "DualSetpoint": {
        if (dual == null) return { __typename: "NotSupported" };
        change = {
          awaySetpointLower: dual.lower,
          awaySetpointUpper: dual.upper,
        };
      }
    }

    const updated = await updateController(id, change);

    loaders.controller.clear(id).prime(id, updated);
    loaders.location.clear(id);

    if (user) loaders.controllers.clear(user.id);

    return {
      __typename: "ChangeControllerAwaySetpointSuccess",
      controller: updated,
    };
  },
  changeLocationAwaySetpoint: async (
    _,
    { input: { id, single, dual } },
    { loaders, user }
  ) => {
    if (!enabled.includes(AwayFeature.AwayLocation))
      return { __typename: "NotSupported" };
    const location = await loaders.location.load(id);

    if (!location) return { __typename: "NotFound" };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const controller = (await loaders.controller.load(
      location.controllerIds[0]
    ))!;

    if (!controller.supportsAway) return { __typename: "NotSupported" };

    let change: Partial<ControllerRecord> = {};
    switch (controller.setpointType) {
      case "SingleSetpoint": {
        if (single == null) return { __typename: "NotSupported" };
        change = {
          awaySetpointTarget: single.target,
        };
        break;
      }
      case "DualSetpoint": {
        if (dual == null) return { __typename: "NotSupported" };
        change = {
          awaySetpointLower: dual.lower,
          awaySetpointUpper: dual.upper,
        };
      }
    }

    await Promise.all(
      location.controllerIds.map(async (controllerId) => {
        const updated = await updateController(controllerId, change);
        loaders.controller.clear(controllerId).prime(controllerId, updated);
      })
    );

    loaders.location.clear(id);

    if (user) loaders.controllers.clear(user.id);

    return {
      __typename: "ChangeLocationAwaySetpointSuccess",
      location,
    };
  },
  toggleControllerAway: async (
    _,
    { input: { id, active } },
    { loaders, user }
  ) => {
    if (!enabled.includes(AwayFeature.AwayController))
      return { __typename: "NotSupported" };

    const controller = await loaders.controller.load(id);

    if (!controller) return { __typename: "NotFound" };
    if (!controller.supportsAway) return { __typename: "NotSupported" };

    const updated = await updateController(id, {
      awayActive: active,
    });

    loaders.controller.clear(id).prime(id, updated);
    loaders.location.clear(id);

    if (user) loaders.controllers.clear(user.id);

    return {
      __typename: "ToggleControllerAwaySuccess",
      controller: updated,
    };
  },
  toggleLocationAway: async (
    _,
    { input: { id, active } },
    { loaders, user }
  ) => {
    if (!enabled.includes(AwayFeature.AwayLocation))
      return { __typename: "NotSupported" };

    const location = await loaders.location.load(id);

    if (!location) {
      return { __typename: "NotFound" };
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const controller = (await loaders.controller.load(
      location.controllerIds[0]
    ))!;

    if (!controller.supportsAway) return { __typename: "NotSupported" };

    await Promise.all(
      location.controllerIds.map(async (controllerId) => {
        const updated = await updateController(controllerId, {
          awayActive: active,
        });
        loaders.controller.clear(controllerId).prime(controllerId, updated);
      })
    );

    loaders.location.clear(id);

    if (user) loaders.controllers.clear(user.id);

    return {
      __typename: "ToggleLocationAwaySuccess",
      location,
    };
  },
};

export const queryResolver: QueryResolvers = {};
