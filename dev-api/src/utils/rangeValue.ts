import { RangeValue } from "../schema";

export const normalizeValue = ({
  min,
  step,
  value,
}: {
  min: number;
  step: number;
  value: number;
}): number => Math.round((value - min) / step) * step + min;

export const normalizeRangeValue = <R extends RangeValue>(rangeValue: R): R => {
  return {
    ...rangeValue,
    value: normalizeValue(rangeValue),
  };
};
