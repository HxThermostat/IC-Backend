import { TemperatureUnit } from "../common";
import { SerializedEvents } from "./schedule";
import { SerializedPresets } from "./temperaturePreset";

export * from "./schedule";
export * from "./temperaturePreset";

export type Metadata = Partial<{
  RoomName: string;
  ScheduleEvents: SerializedEvents;
  TemperaturePresets: SerializedPresets;
  TemperatureUnit: TemperatureUnit;
}>;

export function setMetadata<P extends Metadata, K extends keyof P>(
  metadata: P,
  key: K,
  value: P[K]
): { key: string; value: P[K] } {
  metadata[key] = value;

  return {
    key: key as string,
    value,
  };
}
