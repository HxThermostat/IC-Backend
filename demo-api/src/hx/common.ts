export enum TemperatureUnit {
  C = "C",
  F = "F",
}
export function isTemperatureUnit(unit: unknown): unit is TemperatureUnit {
  return unit === TemperatureUnit.C || unit === TemperatureUnit.F;
}

export type Zone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export function isZone(zone: number): zone is Zone {
  return zone >= 0 && zone <= 7;
}

const zoneMap: { [zone in Zone]: Zone } = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
};
const zones: Zone[] = Object.values(zoneMap);

export function mapZones<T>(callback: (zone: Zone) => T): T[] {
  return zones.map(callback);
}
