import {
  AylaDeviceWithMetadataAndProperties,
  isDeviceWithMetadataAndProperties,
} from "ayla-client";

import { isTemperatureUnit, TemperatureUnit, Zone } from "./common";
import { decodeSysStg } from "./encoders";
import {
  Metadata,
  Event,
  defaultPresets,
  decodePresets,
  decodeEvents,
  defaultEvents,
  Preset,
} from "./metadata";
import type { Properties } from "./properties";

export type AylaDevice = AylaDeviceWithMetadataAndProperties<
  Metadata,
  Properties
>;

export function isAylaDevice(device: unknown): device is AylaDevice {
  return isDeviceWithMetadataAndProperties<Metadata, Properties>(
    device,
    (metadata) => {
      // Make sure the metadata exists
      if (typeof metadata !== "object") {
        return false;
      }

      // Make sure that the room name is set to a reasonable
      // value if defined
      if (metadata.RoomName != null && typeof metadata.RoomName !== "string") {
        return false;
      }

      // Make sure that the temperature unit is set to a reasonable
      // value if defined
      if (
        metadata.TemperatureUnit != null &&
        !isTemperatureUnit(metadata.TemperatureUnit)
      ) {
        return false;
      }

      return true;
    },
    (properties) => typeof properties.SysStg === "number"
  );
}

// The Omit is a sanity check to make sure we're not typing over the
// default attributes of AylaDevice
type ApplicationAttributes = {
  scheduleEvents: { [zone in Zone]: Event[] };
  temperaturePresets: Preset[];
  temperatureUnit: TemperatureUnit;
};
export type Device = AylaDevice & Omit<ApplicationAttributes, keyof AylaDevice>;
export function isDevice(device: unknown): device is Device {
  return isAylaDevice(device);
}

export function enhanceAylaDevice(device: AylaDevice): Device {
  return {
    ...device,
    scheduleEvents:
      decodeEvents(device.metadata.ScheduleEvents) ?? defaultEvents(device),
    temperaturePresets:
      decodePresets(device.metadata.TemperaturePresets) ??
      defaultPresets(device),
    temperatureUnit: device.metadata.TemperatureUnit
      ? device.metadata.TemperatureUnit
      : decodeSysStg(device.properties.SysStg).temperatureUnit,
  };
}
