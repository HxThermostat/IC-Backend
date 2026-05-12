import { fToC as fToCRaw, isEnum, toFixed, toHalf } from "../utils";
import { decodeSysStg } from "./encoders";
import type { Zone } from "./common";
import type { Device } from "./device";

import { isZone, TemperatureUnit } from "./common";

export enum Mode {
  Off = "OFF",
  Heat = "HEAT",
  Cool = "COOL",
  Auto = "AUTO",
  EmergencyHeat = "EHEAT",
  MaxHeat = "MAXHEAT",
  MaxCool = "MAXCOOL",
}
export function isMode(mode: unknown): mode is Mode {
  return isEnum(Mode, mode);
}

type ID = {
  dsn: string;
  zone: Zone;
  zoning: boolean;
};

export function decodeId(id: string): ID {
  const dsn = toDSN(id);
  const zone = zoneNum(id);
  const zoning = id.startsWith("Z");

  return { dsn, zone, zoning };
}

export function encodeId({ dsn, zone, zoning }: ID): string {
  return `${zoning ? "Z" : "N"}${dsn}-${zone}`;
}

export type EffectiveModes = Extract<
  Mode,
  Mode.Off | Mode.Heat | Mode.Cool | Mode.Auto
>;
export function effectiveMode(mode: Mode): EffectiveModes {
  switch (mode) {
    case Mode.Heat:
    case Mode.EmergencyHeat:
    case Mode.MaxHeat:
      return Mode.Heat;
    case Mode.Cool:
    case Mode.MaxCool:
      return Mode.Cool;
    case Mode.Auto:
      return Mode.Auto;
    default:
      return Mode.Off;
  }
}

export function fToC(
  f: number,
  temperatureUnit: TemperatureUnit,
  absolute = true
): number {
  let c: number;

  switch (temperatureUnit) {
    case TemperatureUnit.C:
      c = toHalf(fToCRaw(f, absolute));
      break;
    case TemperatureUnit.F:
      c = fToCRaw(Math.floor(f), absolute);
      break;
  }

  return toFixed(c);
}

export function readBit(src: number, bit: number): 0 | 1 {
  const mask = 0b1 << bit;
  return +((src & mask) === mask) as 0 | 1;
}

export function readBits(src: number, bits: number[]): number {
  return bits.reduce((dst, bit, i) => writeBit(dst, i, readBit(src, bit)), 0);
}

export function toDSN(id: string): string {
  return id.replace(/^[NZ]/, "").replace(/-[0-9]$/, "");
}

export function writeBit(src: number, bit: number, value: 0 | 1): number {
  if (value === 0) {
    return src & ~(1 << bit);
  } else {
    return src | (value << bit);
  }
}

export function isZoning(device: Device): boolean {
  const { SysStg } = device.properties;
  const { zoning } = decodeSysStg(SysStg);

  return zoning;
}

export function deviceZones(device: Device): Array<Zone> {
  const { SysStg } = device.properties;
  const { zoning, zones } = decodeSysStg(SysStg);

  if (!zoning) return [];

  return [...new Array<Zone>(zones)].map((_, i) => i as Zone);
}

export function zoneNum(id: string): Zone {
  const zone = Math.abs(parseInt(id.split("-")[1], 10));

  if (!isZone(zone)) throw new Error(`Invalid zone: ${zone}`);

  return zone;
}
