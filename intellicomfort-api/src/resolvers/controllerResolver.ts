import { isAuthenticationError } from "ayla-client";

import { ControllerMapper } from "../schema/mappers";

import { Resolvers, QueryResolvers, MutationResolvers, Call } from "../schema";

import {
  Mode,
  Zone,
  decodeIdTmp,
  decodeSysStg,
  decodeUsrMd,
  decodeZnStat,
  encodeId,
  fToC,
  isDevice,
  toDSN,
  zoneNum,
  zoneProperty,
} from "../intellicomfort";

import { propagateErrors } from "../utils";

export const resolver: Resolvers = {
  Controller: {
    id: (controller) => encodeId(controller),
    call: ({ properties, zone }) => {
      const { heatRunning, coolRunning } = decodeZnStat(
        zoneProperty(properties, "ZnStat1", zone)
      );

      const systemRunning = heatRunning || coolRunning;

      const mode = decodeUsrMd(zoneProperty(properties, "UsrMd1", zone));

      switch (mode) {
        case Mode.Off:
          return null;
        case Mode.Heat:
        case Mode.EmergencyHeat:
        case Mode.QuickHeat:
          return systemRunning ? Call.Heat : null;
        case Mode.Cool:
        case Mode.QuickCool:
          return systemRunning ? Call.Cool : null;
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
      zoneProperty(properties, "ZnNm1", zone) || name,
    temperatureAmbient: ({ properties, temperatureUnit, zone }) =>
      fToC(
        decodeIdTmp(zoneProperty(properties, "IDTmp1", zone)),
        temperatureUnit
      ),
    zoning: ({ properties: { SysStg } }) => {
      const { zones } = decodeSysStg(SysStg);
      return zones > 1;
    },
  },
  Location: {
    controller: (location) =>
      decodeSysStg(location.properties.SysStg).zones === 1
        ? { ...location, zone: 0 }
        : null,
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
