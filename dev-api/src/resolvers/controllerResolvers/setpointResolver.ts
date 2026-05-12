import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  TemperatureUnit,
} from "../../schema";

import { updateController, ControllerRecord } from "../../fixtures";

import { normalizeValue } from "../../utils/rangeValue";

import { MODES } from "./modeResolver";

const RANGE_MIN = 10;
const RANGE_MAX = 32;

const COOL_MAX = RANGE_MAX;
const COOL_MIN = RANGE_MIN + 5;

const HEAT_MAX = RANGE_MAX - 5;
const HEAT_MIN = RANGE_MIN;

function maxForSetpoint(mode?: "heat" | "cool" | null): number {
  switch (mode) {
    case "heat":
      return HEAT_MAX;
    case "cool":
      return COOL_MAX;
    default:
      return Math.max(HEAT_MAX, COOL_MAX);
  }
}

function minForSetpoint(mode?: "heat" | "cool" | null): number {
  switch (mode) {
    case "heat":
      return HEAT_MIN;
    case "cool":
      return COOL_MIN;
    default:
      return Math.min(HEAT_MIN, COOL_MIN);
  }
}

const fToC = (f: number): number => f * (5 / 9);

export const buildSetpointConstraints = (
  mode?: "heat" | "cool" | null
): Record<
  TemperatureUnit,
  { max: number; min: number; minInterval: number; step: number }
> => {
  const MAX_SETPOINT = maxForSetpoint(mode);
  const MIN_SETPOINT = minForSetpoint(mode);
  return {
    C: {
      max: MAX_SETPOINT,
      min: MIN_SETPOINT,
      minInterval: 1,
      step: 0.5,
    },
    F: {
      max: normalizeValue({
        min: MIN_SETPOINT,
        step: fToC(1),
        value: MAX_SETPOINT,
      }),
      min: normalizeValue({
        min: MIN_SETPOINT,
        step: fToC(1),
        value: MIN_SETPOINT,
      }),
      minInterval: fToC(2),
      step: fToC(1),
    },
  };
};

export const resolver: Resolvers = {
  Controller: {
    setpointRange: () => {
      const heatEnabled = MODES.join().includes("HEAT");
      const coolEnabled = MODES.join().includes("COOL");

      let setpointMax: number;
      let setpointMin: number;

      switch (true) {
        case heatEnabled && coolEnabled:
          setpointMax = Math.max(HEAT_MAX, COOL_MAX);
          setpointMin = Math.min(HEAT_MIN, COOL_MIN);
          break;
        case heatEnabled:
          setpointMax = HEAT_MAX;
          setpointMin = HEAT_MIN;
          break;
        case coolEnabled:
          setpointMax = COOL_MAX;
          setpointMin = COOL_MIN;
          break;
        default:
          setpointMax = Math.max(HEAT_MAX, COOL_MAX);
          setpointMin = Math.min(HEAT_MIN, COOL_MIN);
          break;
      }
      return {
        min: setpointMin,
        max: setpointMax,
      };
    },
    setpoint: async (controller, _, { loaders }) => {
      const location = await loaders.location.load(controller.locationId);

      if (!location) throw new Error();

      const { temperatureUnit } = location;

      let setpointMode: "heat" | "cool" | null;
      switch (controller.mode) {
        case "HEAT":
        case "EHEAT":
        case "QUICKHEAT":
          setpointMode = "heat";
          break;
        case "COOL":
        case "QUICKCOOL":
          setpointMode = "cool";
          break;
        case "AUTO":
        case "OFF":
          setpointMode = null;
          break;
      }
      const { max, min, minInterval, step } = buildSetpointConstraints(
        setpointMode
      )[temperatureUnit];

      if (controller.awayActive) {
        return controller.setpointType === "SingleSetpoint"
          ? {
              __typename: "SingleSetpoint",
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              value: controller.awaySetpointTarget!,
              max,
              min,
              step,
            }
          : {
              __typename: "DualSetpoint",
              lower: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: controller.awaySetpointLower!,
                max: max - minInterval,
                min,
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
            };
      } else {
        return controller.setpointType === "SingleSetpoint"
          ? {
              __typename: "SingleSetpoint",
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              value: controller.setpointTarget!,
              max,
              min,
              step,
            }
          : {
              __typename: "DualSetpoint",
              lower: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: controller.setpointLower!,
                max: max - minInterval,
                min,
                step,
              },
              upper: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: controller.setpointUpper!,
                min: min + minInterval,
                max,
                step,
              },
              minInterval,
            };
      }
    },
  },
};

export const mutationResolver: MutationResolvers = {
  changeSetpoint: async (_, { input: { id, single, dual } }, { loaders }) => {
    const controller = await loaders.controller.load(id);

    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }

    if (single == null && dual == null) {
      return {
        __typename: "ChangeSetpointSuccess",
        controller,
      };
    }

    let change: Partial<ControllerRecord> | undefined = undefined;
    switch (controller.setpointType) {
      case "SingleSetpoint":
        if (single == null) {
          return { __typename: "NotSupported" };
        }
        change = {
          setpointType: "SingleSetpoint",
          setpointTarget: single.target,
        };
        break;
      case "DualSetpoint":
        if (dual == null) {
          return { __typename: "NotSupported" };
        }
        change = {
          setpointType: "DualSetpoint",
          setpointLower: dual.lower,
          setpointUpper: dual.upper,
        };
        break;
      default:
        // No-op
        break;
    }

    if (!change) {
      return {
        __typename: "ChangeSetpointSuccess",
        controller,
      };
    }

    if (controller.holdLengthType !== "NotSupported") {
      change.holdActive = true;
    }

    const updated = await updateController(id, change);
    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();
    return {
      __typename: "ChangeSetpointSuccess",
      controller: updated,
    };
  },
};

export const queryResolver: QueryResolvers = {};
