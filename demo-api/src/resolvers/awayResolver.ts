import { decodeAway, decodeSysStg, zoneProperty } from "../hx";

import {
  AwayFeature,
  DualSetpointMapper,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  SingleSetpointMapper,
} from "../schema";

import { ResolverNotImplemented, ResolverNotSupported } from "./errors";

export const resolver: Resolvers = {
  Controller: {
    away: (controller) => {
      const { properties, zone } = controller;
      const { active, cool, heat } = decodeAway(
        zoneProperty(properties, "Away", zone)
      );

      const { autoModeEnabled, coolEnabled, heatEnabled } = decodeSysStg(
        properties.SysStg
      );

      let setpoint: SingleSetpointMapper | DualSetpointMapper;

      const coolSetpoint: SingleSetpointMapper["setpoint"] = {
        key: "cool",
        value: cool,
      };

      const heatSetpoint: SingleSetpointMapper["setpoint"] = {
        key: "heat",
        value: heat,
      };

      if (autoModeEnabled) {
        setpoint = {
          ...controller,
          lower: coolSetpoint,
          upper: heatSetpoint,
        };
      } else if (coolEnabled) {
        setpoint = { ...controller, setpoint: coolSetpoint };
      } else if (heatEnabled) {
        setpoint = { ...controller, setpoint: heatSetpoint };
      } else {
        throw new Error("Could not find Setpoint");
      }

      return {
        __typename: "Away",
        active,
        setpoint,
      };
    },
  },
  FeatureMap: {
    away: () => [AwayFeature.AwayController],
  },
  Location: {
    away: () => null,
    // Semantically, this field doesn't make sense for
    // AwayFeature.AwayController 🤷
    awayActive: () => false,
  },
};

export const mutationResolver: MutationResolvers = {
  changeControllerAwaySetpoint: ResolverNotImplemented(),
  changeLocationAwaySetpoint: ResolverNotSupported(),
  toggleControllerAway: ResolverNotImplemented(),
  toggleLocationAway: ResolverNotSupported(),
};

export const queryResolver: QueryResolvers = {};
