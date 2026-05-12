import { DualRangeValue, RangeValue } from "../schema";

export function dualRange({
  range,
  lower,
  upper,
  minInterval,
}: {
  range: Omit<RangeValue, "value">;
  lower: number;
  upper: number;
  minInterval?: number;
}): DualRangeValue {
  return {
    lower: { ...range, value: lower },
    upper: { ...range, value: upper },
    minInterval,
  };
}

export function fitInDualRange({
  lower,
  upper,
  minInterval,
}: DualRangeValue): [number, number] {
  const min = fitInRange({ ...lower, max: lower.max - (minInterval ?? 1) });
  const max = fitInRange({ ...upper, min: min + (minInterval ?? 1) });

  return [min, max];
}

export function fitInRange({ max, min, step, value }: RangeValue): number {
  return Math.max(Math.min(normalizeValue({ min, step, value }), max), min);
}

export function normalizeValue({
  min,
  step,
  value,
}: Omit<RangeValue, "max">): number {
  return Math.round((value - min) / step) * step + min;
}

export function normalizeRangeValue<R extends RangeValue>(rangeValue: R): R {
  return {
    ...rangeValue,
    value: normalizeValue(rangeValue),
  };
}
