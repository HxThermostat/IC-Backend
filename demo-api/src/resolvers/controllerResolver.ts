import { isAuthenticationError } from "ayla-client";

import {
  Zone,
  decodeSysStg,
  encodeId,
  fToC,
  isDevice,
  toDSN,
  zoneNum,
  zoneProperty,
  decodeUsrMd,
  Mode,
  decodeZnStat,
} from "../hx";

import {
  Call,
  ControllerMapper,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "../schema";

import { propagateErrors } from "../utils";

export const resolver: Resolvers = {
  Controller: {
    id: ({ dsn, properties: { SysStg }, zone }) =>
      encodeId({ dsn, zone, zoning: decodeSysStg(SysStg).zoning }),
    call: ({ properties, zone }) => {
      const { heatRunning, coolRunning, fanRunning } = decodeZnStat(
        zoneProperty(properties, "ZnStat1", zone)
      );
      const mode = decodeUsrMd(zoneProperty(properties, "UsrMd1", zone));

      const systemRunning = heatRunning || coolRunning;

      switch (mode) {
        case Mode.Off:
          return null;
        case Mode.Heat:
        case Mode.EmergencyHeat:
        case Mode.MaxHeat:
          return systemRunning || fanRunning ? Call.Heat : null;
        case Mode.Cool:
        case Mode.MaxCool:
          return systemRunning || fanRunning ? Call.Cool : null;
        case Mode.Auto:
          return heatRunning ? Call.Heat : coolRunning ? Call.Cool : null;
      }
    },
    humidityAmbient: ({ properties, zone }) => {
      const hum = zoneProperty(properties, "Hum1", zone);

      return hum === 0 ? null : hum;
    },
    location: (controller) => controller,
    name: ({ name, properties, zone }) =>
      zoneProperty(properties, "ZoneName1", zone) || name,
    temperatureAmbient: ({ properties, temperatureUnit, zone }) =>
      fToC(zoneProperty(properties, "IDTmp1", zone), temperatureUnit),
    zoning: ({ properties: { SysStg } }) => decodeSysStg(SysStg).zoning,
  },
  Location: {
    controller: (location) =>
      decodeSysStg(location.properties.SysStg).zoning
        ? null
        : { ...location, zone: 0 },
    controllers: (location) =>
      Array(Math.max(decodeSysStg(location.properties.SysStg).zones, 1))
        .fill(null)
        .map((_, zone) => ({
          ...location,
          zone: zone as Zone,
        })),
  },
};

export const queryResolver: QueryResolvers = {
  controller: async (_root, { id }, { loaders }) => {
    const dsn = toDSN(id);

    const device = await loaders.device.load(dsn);

    if (!isDevice(device)) return null;

    return { ...device, zone: zoneNum(id) };
  },
  controllers: async (_root, _args, { user, loaders }) => {
    if (!user) return [];
    const dsns = await loaders.devices.load(user.accessToken);

    const controllers: ControllerMapper[] = [];

    const devices = propagateErrors(
      await loaders.device.loadMany(dsns),
      isAuthenticationError
    );

    devices.forEach((device) => {
      if (isDevice(device)) {
        const { zones } = decodeSysStg(device.properties.SysStg);

        controllers.push(
          ...Array(Math.max(zones, 1))
            .fill(null)
            .map((_, zone) => ({
              ...device,
              zone: zone as Zone,
            }))
        );
      }
    });

    return controllers;
  },
};
export const mutationResolver: MutationResolvers = {};
