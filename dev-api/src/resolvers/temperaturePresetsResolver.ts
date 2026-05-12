import { AuthenticationError } from "apollo-server-express";

import {
  addTemperaturePreset,
  removeTemperaturePreset,
  TemperaturePresetRecord,
  updateScheduleEvent,
  updateTemperaturePreset,
} from "../fixtures";
import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  Setpoint,
  Slot,
  FanMode,
  ScheduleFeature,
  TemperaturePresetsFeature,
} from "../schema";

import { SetpointConstraints } from "../utils/setpoints";

import { enabled as ScheduleFeatureEnabled } from "./controllerResolvers/scheduleResolver";

const enabled = [
  TemperaturePresetsFeature.BuiltIn,
  TemperaturePresetsFeature.Custom,
];

const deriveSetpointForPreset = (
  preset: TemperaturePresetRecord,
  unit: string
): Setpoint => {
  const { max, min, minInterval, step } = SetpointConstraints[
    unit === "C" ? "C" : "F"
  ];

  return preset.setpointType === "DualSetpoint"
    ? {
        __typename: "DualSetpoint",
        lower: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          value: preset.setpointLower!,
          max: max - minInterval,
          min,
          step,
        },
        upper: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          value: preset.setpointUpper!,
          min: min + minInterval,
          max,
          step,
        },
        minInterval,
      }
    : {
        __typename: "SingleSetpoint",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value: preset.setpointTarget!,
        max,
        min,
        step,
      };
};

export const resolver: Resolvers = {
  FeatureMap: {
    temperaturePresets: () => enabled,
  },
  Location: {
    temperaturePresets: async (location, _args, { user, loaders }) => {
      if (!enabled) return null;
      if (!user) return [];

      const temperaturePresets = await loaders.temperaturePresets.load(user.id);
      const matches = temperaturePresets.filter(
        (preset) => preset.locationId === location.id
      );
      return matches;
    },
  },
  ScheduleEvent: {
    temperaturePreset: async (event, _args, { loaders }) => {
      const temperaturePreset = await loaders.temperaturePreset.load(
        event.temperaturePresetId ?? {
          controllerId: event.controllerId,
          eventId: event.id,
        }
      );
      if (!temperaturePreset) throw new Error();
      return temperaturePreset;
    },
  },
  TemperaturePreset: {
    id: ({ id }) => id,
    slot: ({ slot }) => {
      switch (slot) {
        case "HOME":
          return Slot.Home;
        case "AWAY":
          return Slot.Away;
        case "SLEEP":
          return Slot.Sleep;
        case "CUSTOM":
          return Slot.Custom;
        default:
          return null;
      }
    },
    name: ({ slot, name }) => name ?? slot ?? "Thermostat",
    removable: ({ slot }) => slot === Slot.Custom,
    setpoint: async (preset, _, { loaders }) => {
      const location = await loaders.location.load(preset.locationId);
      if (!location) throw new Error();

      const setpoint = deriveSetpointForPreset(
        preset,
        location.temperatureUnit
      );
      return setpoint;
    },
    fanMode: ({ fanMode }) => {
      switch (fanMode) {
        case "AUTO":
          return FanMode.Auto;
        case "FIFTEEN":
          return FanMode.Fifteen;
        case "THIRTY":
          return FanMode.Thirty;
        case "FORTYFIVE":
          return FanMode.Fortyfive;
        case "ALWAYS":
          return FanMode.Always;
        default:
          return null;
      }
    },
  },
};
export const queryResolver: QueryResolvers = {
  temperaturePreset: (_root, { id }, { loaders }) => {
    if (!enabled) return null;

    return loaders.temperaturePreset.load(id);
  },
  temperaturePresets: (_root, _args, { loaders, user }) => {
    if (!enabled) return null;
    if (!user) return [];

    return loaders.temperaturePresets.load(user.id);
  },
};

export const mutationResolver: MutationResolvers = {
  addTemperaturePreset: async (
    _,
    { input: { id, dual, single, name, fanMode } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const location = await loaders.location.load(id);
    if (!location) return { __typename: "NotFound" };

    let setpoint: Partial<TemperaturePresetRecord> | undefined = undefined;

    if (single) {
      setpoint = {
        setpointType: "SingleSetpoint",
        setpointTarget: single.target,
      };
    }
    if (dual) {
      setpoint = {
        setpointType: "DualSetpoint",
        setpointLower: dual.lower,
        setpointUpper: dual.upper,
      };
    }

    if (!setpoint) return { __typename: "NotSupported" };

    const updated = await addTemperaturePreset({
      locationId: location.id,
      userId: user.id,
      name,
      slot: Slot.Custom,
      ...setpoint,
      fanMode:
        fanMode ??
        // if fan feature is enabled, default to auto if none passed in
        ScheduleFeatureEnabled === ScheduleFeature.ScheduleTemperatureFan
          ? FanMode.Auto
          : undefined,
    });

    loaders.temperaturePresets.clearAll();

    return {
      __typename: "AddTemperaturePresetSuccess",
      temperaturePreset: updated,
    };
  },
  changeTemperaturePresetName: async (
    _,
    { input: { id, name } },
    { loaders }
  ) => {
    const preset = await loaders.temperaturePreset.load(id);
    if (!preset) return { __typename: "NotFound" };

    const updated = await updateTemperaturePreset(id, {
      name,
    });

    loaders.temperaturePreset.clear(id).prime(id, updated);
    loaders.temperaturePresets.clearAll();

    return {
      __typename: "ChangeTemperaturePresetNameSuccess",
      temperaturePreset: updated,
    };
  },
  changeTemperaturePresetSetpoint: async (
    _,
    { input: { id, dual, single } },
    { loaders }
  ) => {
    const preset = await loaders.temperaturePreset.load(id);
    if (!preset) return { __typename: "NotFound" };

    let setpoint: Partial<TemperaturePresetRecord> | undefined = undefined;

    if (single) {
      setpoint = {
        setpointType: "SingleSetpoint",
        setpointTarget: single.target,
      };
    }
    if (dual) {
      setpoint = {
        setpointType: "DualSetpoint",
        setpointLower: dual.lower,
        setpointUpper: dual.upper,
      };
    }

    if (!setpoint) return { __typename: "NotSupported" };

    const updated = await updateTemperaturePreset(id, setpoint);

    loaders.temperaturePreset.clear(id).prime(id, updated);
    loaders.temperaturePresets.clearAll();

    return {
      __typename: "ChangeTemperaturePresetSetpointSuccess",
      temperaturePreset: updated,
    };
  },
  changeTemperaturePresetFanMode: async (
    _,
    { input: { id, fanMode } },
    { loaders }
  ) => {
    const preset = await loaders.temperaturePreset.load(id);
    if (!preset) return { __typename: "NotFound" };

    const updated = await updateTemperaturePreset(id, {
      fanMode,
    });

    loaders.temperaturePreset.clear(id).prime(id, updated);
    loaders.temperaturePresets.clearAll();

    return {
      __typename: "ChangeTemperaturePresetFanModeSuccess",
      temperaturePreset: updated,
    };
  },
  removeTemperaturePreset: async (
    _,
    { input: { id, locationId } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Must be logged in");

    const location = await loaders.location.load(locationId);
    if (!location) return { __typename: "NotFound" };

    const preset = await loaders.temperaturePreset.load(id);
    if (!preset) return { __typename: "NotFound" };

    // Let's just say that only custom presets are removable
    if (!enabled.includes(TemperaturePresetsFeature.Custom))
      return { __typename: "NotSupported" };
    if (preset.slot !== Slot.Custom) return { __typename: "NotSupported" };

    // Update all events within this location's controllers + preset id to default preset, i.e home?
    const eventsToUpdate = (await loaders.scheduleEvents.load(user.id))
      .filter((event) => location.controllerIds.includes(event.controllerId))
      .filter((event) => event.temperaturePresetId === id);

    const HomePreset = (await loaders.temperaturePresets.load(user.id)).find(
      (preset) => preset.slot === "HOME"
    );
    if (!HomePreset) return { __typename: "NotFound" };

    for (const event of eventsToUpdate) {
      await updateScheduleEvent(event.id, {
        id: `${event.controllerId}--${event.id}--virtual`,
      });
    }

    const removed = await removeTemperaturePreset(id);

    loaders.temperaturePresets.clearAll();
    if (removed) {
      return {
        __typename: "RemoveTemperaturePresetSuccess",
      };
    } else {
      return {
        __typename: "NotFound",
      };
    }
  },
};
