import moment from "moment";

import chroma from "chroma-js";

import { sortBy } from "lodash";

import {
  DualRangeValue,
  SetpointFieldsFragment,
  TemperatureUnit,
} from "~/graph";

export const degreesSymbol = "\u00B0";

export const VALID_EMAIL = new RegExp(/^\S+@\S+$/);

export const isValidEmail = (email: string | undefined | null): boolean =>
  !!email && VALID_EMAIL.test(email);

export const displayCelsiusValue = (temperatureInC: number): number => {
  return Math.round(temperatureInC * 10) / 10;
};

export const fromCelsiusToFahrenheit = (temperatureInC: number): number => {
  return Math.round(((temperatureInC * 9) / 5 + 32) * 10) / 10;
};

export const toDisplay = (
  temperatureUnit: TemperatureUnit,
  value: number
): number => {
  return (temperatureUnit === "F"
    ? fromCelsiusToFahrenheit
    : displayCelsiusValue)(value);
};

export const makeToDisplay = (
  temperatureUnit: TemperatureUnit
): ((value: number) => number) => {
  return (value: number) => toDisplay(temperatureUnit, value);
};

export const DateFormatter = (format: string): ((date: Date) => string) => (
  date: Date
) => moment(date).format(format);
const convertTemperatureToNumber = (value: string | number): number =>
  typeof value === "string" ? parseFloat(value) : value;

export const displayValueWithoutDecimal = (
  value: number | undefined | string
): number | undefined => {
  if (value) {
    const temperature = convertTemperatureToNumber(value);
    return Math.trunc(temperature);
  }
};

export const hasDecimalPlace = (
  value: number | undefined | string
): boolean => {
  if (value) {
    const temperature = convertTemperatureToNumber(value);
    return temperature % 1 !== 0;
  }
  return false;
};

export const displayableDecimalValueOfNumber = (
  value: number | undefined | string
): number | undefined => {
  if (value) {
    const temperature = convertTemperatureToNumber(value);
    const result = Math.abs(Math.round((temperature % 1) * 10));
    if (result === 10) {
      return 9; // don't roll over to 10, e.g 12.96, 12.98, 12.99 etc.
    } else {
      return result;
    }
  }
};

export const setpointRange = (
  setpoint: SetpointFieldsFragment,
  toDisplay: (temp: number) => number
): string => {
  switch (setpoint.__typename) {
    case "SingleSetpoint":
      return `${toDisplay(setpoint.value)}${degreesSymbol}`;
    case "DualSetpoint":
      return `${toDisplay(setpoint.lower.value)}-${toDisplay(
        setpoint.upper.value
      )}${degreesSymbol}`;
    default:
      throw new Error("Unexpected setpoint type");
  }
};

export const temperatureRange = (
  range: DualRangeValue,
  toDisplay: (temp: number) => number
): string => {
  return `${toDisplay(range.lower.value)}-${toDisplay(
    range.upper.value
  )}${degreesSymbol}`;
};

export const humidityRange = (range: DualRangeValue): string => {
  return `${Math.trunc(range.lower.value)}-${Math.trunc(range.upper.value)}%`;
};

function isObjectKey<
  Map extends Record<string, unknown>,
  Key extends string & keyof Map
>(key: string, map: Record<string, unknown>): key is Key {
  return !!map[key];
}

export function colorForBackground<
  Palette extends Record<string, string>,
  Color extends keyof Palette
>(background: string | chroma.Color, colors: Color[], palette: Palette): Color {
  const backgroundColor =
    typeof background === "object"
      ? background
      : isObjectKey(background, palette)
      ? palette[background]
      : background;

  const sorted = sortBy(colors, (c) => chroma(palette[c]).luminance());

  // If the color is dark, find the lightest color or vice versa
  // n.b. this is different than saying "find the color with the most
  // different luminance" in a case like:
  // backgroundColor: 0.4
  // colors: [0.1, 0.6]
  // While 0.1 is _further_ from 0.4, we want to choose the color that
  // produces a luminance of 0.6 since it generally matches our
  // aesthetic choices for this app
  if (chroma(backgroundColor).luminance() >= 0.5) {
    return sorted[0];
  } else {
    return sorted[sorted.length - 1];
  }
}
