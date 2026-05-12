import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  EffectiveMode,
  Placement,
} from "../../schema";

import { updateController, ControllerRecord } from "../../fixtures";

type Mode = ControllerRecord["mode"];

const PRIMARY_MODES: Mode[] = ["HEAT", "COOL", "AUTO", "OFF"];
const SECONDARY_MODES: Mode[] = ["QUICKHEAT", "QUICKCOOL", "EHEAT"];
export const MODES: Mode[] = [...PRIMARY_MODES, ...SECONDARY_MODES];

function isMode(mode: string): mode is Mode {
  return MODES.includes(mode as Mode);
}

const effectiveMode = (mode: string): EffectiveMode => {
  switch (mode) {
    case "HEAT":
    case "QUICKHEAT":
    case "EHEAT":
      return EffectiveMode.Heat;
    case "COOL":
    case "QUICKCOOL":
      return EffectiveMode.Cool;
    case "AUTO":
      return EffectiveMode.Heatcool;
    default:
      return EffectiveMode.Off;
  }
};

const transitionFrom = (mode: Mode): Mode[] => {
  switch (mode) {
    case "QUICKHEAT":
      return MODES.filter((m) => effectiveMode(m) !== EffectiveMode.Cool);
    case "QUICKCOOL":
      return MODES.filter((m) => effectiveMode(m) !== EffectiveMode.Heat);
    default:
      return MODES;
  }
};

const transitionTo = (mode: Mode): Mode[] => {
  switch (effectiveMode(mode)) {
    case EffectiveMode.Heat:
      return MODES.filter((m) => m !== "QUICKCOOL");
    case EffectiveMode.Cool:
      return MODES.filter((m) => m !== "QUICKHEAT");
    default:
      return MODES;
  }
};

export const resolver: Resolvers = {
  Controller: {
    mode: ({ mode }) => mode,
    modes: () => MODES,
  },
  Mode: {
    effectiveMode,
    name: (mode) => mode,
    placement: (mode) =>
      PRIMARY_MODES.includes(mode) ? Placement.Primary : Placement.Secondary,
    transitionFrom,
    transitionTo,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  changeMode: async (_, { input: { id, mode: newMode } }, { loaders }) => {
    const controller = await loaders.controller.load(id);

    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }

    if (!isMode(newMode)) {
      return {
        __typename: "InvalidMode",
      };
    }

    if (!transitionTo(controller.mode).includes(newMode)) {
      return {
        __typename: "InvalidModeTransition",
      };
    }

    const updated = await updateController(id, { mode: newMode });

    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();

    return {
      __typename: "ChangeModeSuccess",
      controller: updated,
    };
  },
};
