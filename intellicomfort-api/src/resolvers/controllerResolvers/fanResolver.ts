import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import { FanSpeed, decodeZnStat, zoneProperty } from "../../intellicomfort";

export const resolver: Resolvers = {
  Controller: {
    fan: (controller) => controller,
  },
  Fan: {
    __resolveType: () => "SpeedNameFan",
  },
  SpeedNameFan: {
    activeSpeedName: ({ properties, zone }) => {
      const { fanSpeed } = decodeZnStat(
        zoneProperty(properties, "ZnStat1", zone)
      );

      switch (fanSpeed) {
        case FanSpeed.Off:
          // NOTE: We are explicitly returning null for the Off case.
          return null;
        case FanSpeed.Slow:
          return "LOW";
        case FanSpeed.Medium:
          return "MEDIUM";
        case FanSpeed.Fast:
          return "HIGH";
      }
    },
    running: ({ properties, zone }) => {
      const { fanSpeed } = decodeZnStat(
        zoneProperty(properties, "ZnStat1", zone)
      );

      return fanSpeed !== FanSpeed.Off;
    },
  },
};

export const queryResolver: QueryResolvers = {};
export const mutationResolver: MutationResolvers = {};
