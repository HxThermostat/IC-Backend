import {
  AylaConnectionStatus,
  isAuthenticationError,
  unregisterDevice,
  writeDatapoints,
} from "ayla-client";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  ConnectionStatus,
} from "../schema";

import {
  decodeSysStg,
  decodeVacOvr,
  encodeVacOvr,
  fToC,
  isDevice,
} from "../intellicomfort";

import { propagateErrors } from "../utils";

export const resolver: Resolvers = {
  Location: {
    id: ({ dsn }) => dsn,
    awayActive: ({ properties: { VacOvr } }) => decodeVacOvr(VacOvr).enabled,
    connectionStatus: ({ connectionStatus }) =>
      connectionStatus === AylaConnectionStatus.Online
        ? ConnectionStatus.Online
        : ConnectionStatus.Offline,
    lat: ({ lat }) => lat ?? null,
    lng: ({ lng }) => lng ?? null,
    name: ({ name }) => name,
    temperatureOutdoor: ({ properties: { ODTmp }, temperatureUnit }) =>
      ODTmp === 128 ? null : fToC(ODTmp, temperatureUnit),
    zoning: ({ properties: { SysStg } }) => decodeSysStg(SysStg).zones > 1,
  },
};

export const queryResolver: QueryResolvers = {
  location: async (_root, { id }, { loaders }) => {
    const device = await loaders.device.load(id);

    return isDevice(device) ? device : null;
  },
  locations: async (_root, _args, { user, loaders }) => {
    if (!user) return [];
    const dsns = await loaders.devices.load(user.accessToken);

    return propagateErrors(
      await loaders.device.loadMany(dsns),
      isAuthenticationError
    ).filter(isDevice);
  },
};

export const mutationResolver: MutationResolvers = {
  removeLocation: async (_root, { input: { id } }, { user }) => {
    if (!user) {
      return {
        __typename: "NotFound",
      };
    }

    try {
      await unregisterDevice({ dsn: id, accessToken: user.accessToken });
      return {
        __typename: "RemoveLocationSuccess",
      };
    } catch {
      return {
        __typename: "NotFound",
      };
    }
  },
  changeLocationAway: async (
    _root,
    { input: { id, active } },
    { user, loaders }
  ) => {
    if (!user) {
      return {
        __typename: "NotFound",
      };
    }
    const location = await loaders.device.load(id);

    if (!isDevice(location)) {
      return {
        __typename: "NotFound",
      };
    }

    location.properties.VacOvr = encodeVacOvr({
      ...decodeVacOvr(location.properties.VacOvr),
      enabled: active,
    });

    await writeDatapoints({
      datapoints: [
        {
          dsn: id,
          propertyName: "VacOvr",
          value: location.properties.VacOvr,
        },
      ],
      accessToken: user.accessToken,
    });

    loaders.device.clear(id).prime(id, location);
    loaders.devices.clear(user.accessToken);

    return {
      __typename: "ChangeLocationAwaySuccess",
      location,
    };
  },
};
