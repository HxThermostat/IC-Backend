import { AuthenticationError } from "apollo-server-errors";

import { renameDevice, writeDatapoints, writeMetadata } from "ayla-client";

import {
  MutationResolvers,
  QueryResolvers,
  RenameFeature,
  Resolvers,
} from "../schema";

import {
  decodeId,
  enhanceAylaDevice,
  isDevice,
  isZoning,
  setMetadata,
  setZoneProperty,
} from "../hx";

import { NotFound } from "./errors";

const CONTROLLER_NOT_FOUND = NotFound("Controller not found");
const LOCATION_NOT_FOUND = NotFound("Location not found");

export const resolver: Resolvers = {
  FeatureMap: {
    rename: () => [RenameFeature.Controller, RenameFeature.Location],
  },
};

export const mutationResolver: MutationResolvers = {
  renameController: async (
    _root,
    { input: { id, name } },
    { user, loaders }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const { accessToken } = user;
    const { dsn, zone } = decodeId(id);
    const device = await loaders.device.load(dsn);

    if (!isDevice(device)) return CONTROLLER_NOT_FOUND;

    if (isZoning(device)) {
      await writeDatapoints({
        datapoints: {
          dsn,
          ...setZoneProperty(device.properties, "ZoneName1", zone, name),
        },
        accessToken,
      });
    } else {
      await writeMetadata({
        dsn,
        ...setMetadata(device.metadata, "RoomName", name),
        accessToken,
      });
    }

    loaders.device.clear(dsn).prime(dsn, enhanceAylaDevice(device));
    return {
      __typename: "RenameControllerSuccess",
      controller: { ...device, zone },
    };
  },
  renameLocation: async (_root, { input: { id, name } }, { loaders, user }) => {
    if (!user) throw new AuthenticationError("Authentication required");
    const location = await loaders.device.load(id);

    if (!isDevice(location)) return LOCATION_NOT_FOUND;

    location.name = name;

    await renameDevice({
      dsn: id,
      name: location.name,
      accessToken: user.accessToken,
    });

    loaders.device.clear(id).prime(id, enhanceAylaDevice(location));
    return {
      __typename: "RenameLocationSuccess",
      location,
    };
  },
};

export const queryResolver: QueryResolvers = {};
