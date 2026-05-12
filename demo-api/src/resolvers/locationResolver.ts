import {
  AylaConnectionStatus,
  isAuthenticationError,
  unregisterDevice,
} from "ayla-client";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  ConnectionStatus,
} from "../schema";

import { decodeSysStg, fToC, isDevice } from "../hx";

import { propagateErrors } from "../utils";

export const resolver: Resolvers = {
  Location: {
    id: ({ dsn }) => dsn,
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
};
