import { AuthenticationError } from "apollo-server-express";

import { AylaBatchDatapoint, writeDatapoints } from "ayla-client";

import {
  EffectiveMode,
  MutationResolvers,
  Placement,
  QueryResolvers,
  Resolvers,
} from "../../schema";

import {
  decodeId,
  decodeSysStg,
  decodeUsrMd,
  effectiveMode,
  encodeUsrMd,
  enhanceAylaDevice,
  isMode,
  Mode,
  setZoneProperty,
  zoneProperty,
} from "../../hx";

import { NotFound } from "../errors";

const PRIMARY_MODES = [Mode.Heat, Mode.Cool, Mode.Auto, Mode.Off];
const SECONDARY_MODES = [Mode.EmergencyHeat, Mode.MaxHeat, Mode.MaxCool];
const MODES = [...PRIMARY_MODES, ...SECONDARY_MODES];

const CONTROLLER_NOT_FOUND = NotFound("Controller not found");

function supportedModes(sysStg: number): Mode[] {
  const { heatEnabled, coolEnabled } = decodeSysStg(sysStg);

  return MODES.filter((mode) => {
    if (effectiveMode(mode) === Mode.Cool && coolEnabled) return true;
    if (effectiveMode(mode) === Mode.Heat && heatEnabled) return true;
    if (effectiveMode(mode) === Mode.Auto && heatEnabled && coolEnabled)
      return true;
    if (effectiveMode(mode) === Mode.Off) return true;
  });
}

function transitionFrom(mode: Mode, supportedModes: Mode[]): Mode[] {
  switch (mode) {
    case Mode.MaxHeat:
      return supportedModes.filter((m) => effectiveMode(m) !== Mode.Cool);
    case Mode.MaxCool:
      return supportedModes.filter((m) => effectiveMode(m) !== Mode.Heat);
    default:
      return supportedModes;
  }
}

function transitionTo(mode: Mode, supportedModes: Mode[]): Mode[] {
  switch (effectiveMode(mode)) {
    case Mode.Heat:
      return supportedModes.filter((m) => m !== Mode.MaxCool);
    case Mode.Cool:
      return supportedModes.filter((m) => m !== Mode.MaxHeat);
    case Mode.Off:
      return supportedModes.filter(
        (m) => m !== Mode.MaxCool && m !== Mode.MaxHeat
      );
    default:
      return supportedModes;
  }
}

export const resolver: Resolvers = {
  Controller: {
    mode: (controller) => [
      decodeUsrMd(
        zoneProperty(controller.properties, "UsrMd1", controller.zone)
      ),
      controller,
    ],
    modes: (controller) =>
      supportedModes(controller.properties.SysStg).map((mode) => [
        mode,
        controller,
      ]),
  },
  Mode: {
    effectiveMode: ([mode]) => {
      switch (effectiveMode(mode)) {
        case Mode.Auto:
          return EffectiveMode.Heatcool;
        case Mode.Cool:
          return EffectiveMode.Cool;
        case Mode.Heat:
          return EffectiveMode.Heat;
        case Mode.Off:
          return EffectiveMode.Off;
      }
    },
    name: ([mode]) => mode,
    placement: ([mode]) =>
      PRIMARY_MODES.includes(mode) ? Placement.Primary : Placement.Secondary,
    transitionFrom: ([mode, controller]) =>
      transitionFrom(
        mode,
        supportedModes(controller.properties.SysStg)
      ).map((mode) => [mode, controller]),
    transitionTo: ([mode, controller]) =>
      transitionTo(
        mode,
        supportedModes(controller.properties.SysStg)
      ).map((mode) => [mode, controller]),
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  changeMode: async (_root, { input: { id, mode } }, { user, loaders }) => {
    if (!user) throw new AuthenticationError("Authentication required");
    if (!isMode(mode)) {
      return {
        __typename: "InvalidMode",
      };
    }

    const { accessToken } = user;
    const { dsn, zone: targetZone } = decodeId(id);
    const device = await loaders.device.load(dsn);

    if (!device) return CONTROLLER_NOT_FOUND;

    const { SysStg } = device.properties;
    const { zoning, zones: systemZones } = decodeSysStg(SysStg);

    if (zoning && targetZone >= systemZones) return CONTROLLER_NOT_FOUND;

    const currentMode = decodeUsrMd(
      zoneProperty(device.properties, "UsrMd1", targetZone)
    );
    const datapoints: AylaBatchDatapoint[] = [];

    if (currentMode !== mode) {
      // Set the previous mode
      datapoints.push({
        dsn: device.dsn,
        ...setZoneProperty(
          device.properties,
          "UsrMd1Prev",
          targetZone,
          encodeUsrMd(currentMode)
        ),
      });
      // Set the new mode
      datapoints.push({
        dsn: device.dsn,
        ...setZoneProperty(
          device.properties,
          "UsrMd1",
          targetZone,
          encodeUsrMd(mode)
        ),
      });

      await writeDatapoints({
        datapoints,
        accessToken,
      });

      loaders.device.clear(dsn).prime(dsn, enhanceAylaDevice(device));
    }

    return {
      __typename: "ChangeModeSuccess" as const,
      controller: { ...device, zone: targetZone },
    };
  },
};
