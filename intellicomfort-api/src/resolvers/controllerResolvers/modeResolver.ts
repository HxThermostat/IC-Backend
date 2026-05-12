import { AuthenticationError } from "apollo-server-express";
import { AylaBatchDatapoint, writeDatapoints } from "ayla-client";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  EffectiveMode,
  Placement,
} from "../../schema";

import {
  decodeId,
  decodeQuickHtCl,
  decodeSysStg,
  decodeUsrMd,
  effectiveMode,
  encodeQuickHtCl,
  encodeUsrMd,
  isDevice,
  MIN_INTERVAL,
  Mode,
  setProperty,
  setZoneProperty,
  zoneProperty,
} from "../../intellicomfort";

const PRIMARY_MODES = [Mode.Heat, Mode.Cool, Mode.Auto, Mode.Off];
const SECONDARY_MODES = [Mode.QuickHeat, Mode.QuickCool, Mode.EmergencyHeat];
const MODES = [...PRIMARY_MODES, ...SECONDARY_MODES];

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
    case Mode.QuickHeat:
      return supportedModes.filter((m) => effectiveMode(m) !== Mode.Cool);
    case Mode.QuickCool:
      return supportedModes.filter((m) => effectiveMode(m) !== Mode.Heat);
    default:
      return supportedModes;
  }
}

function transitionTo(mode: Mode, supportedModes: Mode[]): Mode[] {
  switch (effectiveMode(mode)) {
    case Mode.Heat:
      return supportedModes.filter((m) => m !== Mode.QuickCool);
    case Mode.Cool:
      return supportedModes.filter((m) => m !== Mode.QuickHeat);
    case Mode.Off:
      return supportedModes.filter(
        (m) => m !== Mode.QuickCool && m !== Mode.QuickHeat
      );
    default:
      return supportedModes;
  }
}

export const resolver: Resolvers = {
  Controller: {
    mode: (controller) => [
      decodeQuickHtCl(controller.properties.QuickHtCl) ??
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
  changeMode: async (_, { input: { id, mode } }, { loaders, user }) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const targetMode: Mode = mode as Mode;

    const { dsn, zone } = decodeId(id);

    const controller = await loaders.device.load(dsn);

    if (!isDevice(controller)) {
      return {
        __typename: "NotFound",
      };
    }

    const modes = supportedModes(controller.properties.SysStg);
    if (!modes.includes(targetMode)) {
      return {
        __typename: "InvalidMode",
      };
    }

    const currentMode = decodeUsrMd(
      zoneProperty(controller.properties, "UsrMd1", zone)
    );

    if (!transitionTo(currentMode, modes).includes(targetMode)) {
      return {
        __typename: "InvalidModeTransition",
      };
    }

    const datapoints: AylaBatchDatapoint[] = [];

    switch (targetMode) {
      case Mode.QuickCool:
      case Mode.QuickHeat:
        datapoints.push({
          dsn,
          ...setProperty(
            controller.properties,
            "QuickHtCl",
            encodeQuickHtCl(targetMode)
          ),
        });
        break;
      case Mode.Auto:
        // The device will allow the values of ClStpt and HtStpt to be
        // "invalid" relative to each other as long as the device
        // isn't in Auto mode. Once the device enters Auto mode, those
        // setpoint values will be reconciled to ensure that
        // MIN_INTERVAL is maintained between the two setpoint values.
        //
        // The device will handle this asynchronously if we don't do
        // it here, but we're pre-empting this behavior so that we can
        // return the expected / correct setpoints in the same
        // transaction when we change to auto mode.
        datapoints.push({
          dsn,
          ...setZoneProperty(
            controller.properties,
            "ClStpt1",
            zone,
            Math.max(
              zoneProperty(controller.properties, "ClStpt1", zone),
              zoneProperty(controller.properties, "HtStpt1", zone) +
                MIN_INTERVAL
            )
          ),
        });
      // fall through to set the remaining datapoints
      default:
        datapoints.push(
          {
            dsn,
            ...setZoneProperty(
              controller.properties,
              "UsrMd1",
              zone,
              encodeUsrMd(targetMode)
            ),
          },
          {
            dsn,
            ...setZoneProperty(
              controller.properties,
              "QuickHtCl",
              zone,
              encodeQuickHtCl(targetMode)
            ),
          }
        );
    }

    await writeDatapoints({
      datapoints,
      accessToken: user.accessToken,
    });

    loaders.device.clear(id).prime(id, controller);

    return {
      __typename: "ChangeModeSuccess",
      controller: {
        ...controller,
        zone,
      },
    };
  },
};
