import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import { normalizeRangeValue } from "../../utils/rangeValue";

const toFixed = (f: number, precision = 4): number =>
  Math.trunc(f * Math.pow(10, precision)) / Math.pow(10, precision);

export const resolver: Resolvers = {
  SingleSetpoint: {
    max: ({ max }) => toFixed(max),
    min: ({ min }) => toFixed(min),
    step: ({ step }) => toFixed(step),
    // This will ensure that the values returned by the Graph are
    // normalized to the constraints of the RangeValue
    // (e.g. if step = 0.5, value = 1.4 => 1.5)
    value: (setpoint) => toFixed(normalizeRangeValue(setpoint).value),
  },
  DualSetpoint: {
    minInterval: ({ minInterval }) => toFixed(minInterval),
  },
};

export const mutationResolver: MutationResolvers = {};

export const queryResolver: QueryResolvers = {};
