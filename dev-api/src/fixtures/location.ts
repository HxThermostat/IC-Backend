import { Location, Controller, FaultLog } from "../data/models";
import { FaultLogAttributes } from "../data/models/FaultLog";
import {
  LocationAttributes,
  LocationCreationAttributes,
} from "../data/models/Location";

import { toPOJO as toModelPOJO, WithoutModel } from "./util";

export type LocationRecord = WithoutModel<LocationAttributes> & {
  controllerIds: string[];
  faultLogs: WithoutModel<FaultLogAttributes>[];
};

function toPOJO(model: Location): LocationRecord {
  return {
    ...toModelPOJO(model),
    controllerIds: model.controllerIds,
    faultLogs: model.faultLogs?.map(toModelPOJO) ?? [],
  };
}

const include = [
  {
    model: Controller,
    as: "controllers",
  },
  {
    model: FaultLog,
    as: "faultLogs",
  },
];

export const addLocation = async (
  location: LocationCreationAttributes
): Promise<LocationRecord> =>
  toPOJO(await Location.create(location, { include }));

export const loadLocations = async (
  locationIds: string[]
): Promise<LocationRecord[]> =>
  (
    await Location.findAll({
      where: { id: locationIds },
      include,
    })
  ).map(toPOJO);

export const loadLocationsByUserId = async (
  userId: string
): Promise<LocationRecord[]> =>
  (
    await Location.findAll({
      where: { userId },
      include,
    })
  ).map(toPOJO);

export const updateLocation = async (
  id: string,
  change: Partial<LocationRecord>
): Promise<LocationRecord> => {
  const found = await Location.findByPk(id, {
    include,
  });

  if (!found) {
    throw new Error(`Location (id: ${id}) not found!`);
  }

  return toPOJO(await found.update(change));
};

export const removeLocation = async (
  id: string
): Promise<LocationRecord | undefined> => {
  const found = await Location.findByPk(id, {
    include,
  });

  if (!found) {
    throw new Error(`Unable to find Location with id: ${id}`);
  }

  await found.destroy();

  return toPOJO(found);
};
