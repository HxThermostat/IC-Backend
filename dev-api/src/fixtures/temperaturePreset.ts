import {
  TemperaturePreset,
  TemperaturePresetAttributes,
  TemperaturePresetCreationAttributes,
} from "../data/models/TemperaturePreset";

import { toPOJO, WithoutModel } from "./util";

export type TemperaturePresetRecord = WithoutModel<TemperaturePresetAttributes>;
export const addTemperaturePreset = async (
  temperaturePreset: TemperaturePresetCreationAttributes
): Promise<TemperaturePresetRecord> =>
  toPOJO(await TemperaturePreset.create(temperaturePreset));

export const loadTemperaturePresets = async (
  temperaturePresetIds: string[]
): Promise<TemperaturePresetRecord[]> =>
  (
    await TemperaturePreset.findAll({
      where: {
        id: temperaturePresetIds,
      },
    })
  ).map(toPOJO);

export const loadTemperaturePresetsByUserId = async (
  userId: string
): Promise<TemperaturePresetRecord[]> =>
  (
    await TemperaturePreset.findAll({
      where: {
        userId,
      },
    })
  ).map(toPOJO);

export const updateTemperaturePreset = async (
  id: string,
  change: Partial<TemperaturePresetRecord>
): Promise<TemperaturePresetRecord> => {
  const found = await TemperaturePreset.findByPk(id);

  if (!found) {
    throw new Error(`Unable to find TemperaturePreset with id: ${id}`);
  }

  return toPOJO(await found.update(change));
};

export const removeTemperaturePreset = async (
  id: string
): Promise<TemperaturePresetRecord | undefined> => {
  const found = await TemperaturePreset.findByPk(id);

  if (!found) {
    throw new Error(`Unable to find TemperaturePreset with id: ${id}`);
  }

  await found.destroy();

  return toPOJO(found);
};
