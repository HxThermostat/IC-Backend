import { TemperatureUnit } from "../../schema";

import { normalizeValue } from "../rangeValue";

const RANGE_MIN = 10;
const RANGE_MAX = 32;

const fToC = (f: number): number => f * (5 / 9);

export const SetpointConstraints: Record<
  TemperatureUnit,
  { max: number; min: number; minInterval: number; step: number }
> = {
  C: {
    max: RANGE_MAX,
    min: RANGE_MIN,
    minInterval: 1,
    step: 0.5,
  },
  F: {
    max: normalizeValue({
      min: RANGE_MIN,
      step: fToC(1),
      value: RANGE_MAX,
    }),
    min: normalizeValue({
      min: RANGE_MIN,
      step: fToC(1),
      value: RANGE_MIN,
    }),
    minInterval: fToC(2),
    step: fToC(1),
  },
};
