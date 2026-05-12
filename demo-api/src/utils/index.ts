import { random } from "lodash";

export * from "./rangeValue";

export const cToF = (c: number, absolute = true): number =>
  c * (9 / 5) + (absolute ? 32 : 0);

export const fToC = (f: number, absolute = true): number =>
  ((f - (absolute ? 32 : 0)) * 5) / 9;

export const isNotNull = <T>(input: T | null | undefined): input is T =>
  input != null;

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randSleep = (min: number, max: number): Promise<void> =>
  sleep(random(min, max));

export const propagateErrors = <T, E extends T>(
  entity: Array<T>,
  predicate: (e: T) => e is E
): Array<T> => {
  const error = (Array.isArray(entity) ? entity : [entity]).find(predicate);

  if (error) throw error;

  return entity;
};

export const toFixed = (f: number, precision = 4): number =>
  Math.trunc(f * Math.pow(10, precision)) / Math.pow(10, precision);

export const toHalf = (c: number): number => Math.ceil(c * 2) / 2;

export const findHalf = (
  f: number,
  minMax: "min" | "max",
  absolute = true
): number => {
  const adjustment = cToF(0.5, false);
  let half = toFixed(cToF(toHalf(fToC(f, absolute)), absolute));

  if (minMax === "min" && half < f) {
    half = half + adjustment;
  } else if (minMax === "max" && half > f) {
    half = half - adjustment;
  }

  return toFixed(half);
};

export const handleEnum = <E extends string | number | symbol, T>(
  value: E,
  options: { [key in E]: T }
): T => options[value];

export function isEnum<T>(e: T, value: unknown): value is T {
  return Object.values(e).includes(value as T);
}

export function hasOwnProperty<
  X extends Record<PropertyKey, unknown>,
  Y extends PropertyKey
>(obj: unknown, prop: Y): obj is X & Record<Y, unknown> {
  return (
    typeof obj === "object" && Object.prototype.hasOwnProperty.call(obj, prop)
  );
}

export function next<T>(items: T[], item: T): T {
  let index = items.findIndex((_item) => _item === item);

  if (index == items.length - 1) {
    index = 0;
  } else {
    index = index + 1;
  }

  return items[index];
}

export function prev<T>(items: T[], item: T): T {
  let index = items.findIndex((_item) => _item === item);

  if (index == 0) {
    index = items.length - 1;
  } else {
    index = index - 1;
  }

  return items[index];
}
