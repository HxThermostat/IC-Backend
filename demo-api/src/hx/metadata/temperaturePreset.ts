import { Brand } from "utility-types";

import { AylaDevice } from "../device";

import { Slot, TemperaturePreset } from "../../schema";

export type SerializedPresets = Brand<string, "TemperaturePresets">;

export type Preset = Omit<
  TemperaturePreset,
  "__typename" | "setpoint" | "slot"
> & {
  dsn: string;
  setpoint: { lower: number; upper: number };
  slot: Slot | null;
};

export function defaultPresets({ dsn }: AylaDevice): Preset[] {
  return [
    {
      id: `${dsn}-HOME`,
      name: "Home",
      slot: Slot.Home,
      setpoint: {
        lower: 70,
        upper: 78,
      },
      removable: false,
    },
    {
      id: `${dsn}-AWAY`,
      name: "Away",
      slot: Slot.Away,
      setpoint: {
        lower: 66,
        upper: 80,
      },
      removable: false,
    },
    {
      id: `${dsn}-SLEEP`,
      name: "Sleep",
      slot: Slot.Sleep,
      setpoint: {
        lower: 64,
        upper: 76,
      },
      removable: false,
    },
  ].map((preset) => ({ ...preset, dsn }));
}

export function decodePresets(
  presets?: SerializedPresets
): Preset[] | undefined {
  if (!presets) return;
  return JSON.parse(presets) as Preset[];
}

export function encodePresets(presets: Event[]): SerializedPresets {
  return JSON.stringify(presets) as SerializedPresets;
}
