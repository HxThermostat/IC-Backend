import DataLoader from "dataloader";

import type { Loaders } from ".";

export function temperaturePresetLoader(
  deviceLoader: Loaders["device"]
): Loaders["temperaturePreset"] {
  return new DataLoader(
    async (presetIds: readonly string[]) => {
      const [presetId] = presetIds;
      const [dsn] = presetId.split("-");

      const device = await deviceLoader.load(dsn);

      const preset = device?.temperaturePresets.find(
        (preset) => preset.id === presetId
      );

      return preset ? [preset] : [];
    },
    { batch: false }
  );
}

export function temperaturePresetsLoader(
  deviceLoader: Loaders["device"]
): Loaders["temperaturePresets"] {
  return new DataLoader(
    async (dsns: readonly string[]) => {
      const [dsn] = dsns;

      const device = await deviceLoader.load(dsn);

      return device ? [device.temperaturePresets] : [];
    },
    { batch: false }
  );
}
