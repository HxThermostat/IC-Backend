import { deviceDSNs, deviceWithMetadataAndProperties } from "ayla-client";

import DataLoader from "dataloader";

import type { Loaders } from ".";

import { enhanceAylaDevice, Metadata, Properties } from "../../hx";

export function deviceLoader(accessToken?: string): Loaders["device"] {
  return new DataLoader(
    async (ids: readonly string[]) => {
      const [dsn] = ids;

      if (!accessToken) return [null];

      const device = await deviceWithMetadataAndProperties<
        Metadata,
        Properties
      >({
        dsn,
        accessToken,
      });

      return [enhanceAylaDevice(device)];
    },
    { batch: false }
  );
}

export function devicesLoader(): Loaders["devices"] {
  return new DataLoader(
    async (ids: readonly string[]) => {
      const [accessToken] = ids;

      return [
        await deviceDSNs({
          accessToken,
          isSupportedDevice: ({ oem_model }) => oem_model.startsWith("Onyx"),
        }),
      ];
    },
    { batch: false }
  );
}
