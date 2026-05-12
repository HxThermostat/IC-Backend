import { AuthenticationError } from "apollo-server-errors";
import { writeDatapoints } from "ayla-client";

import {
  DefaultHoldLengthFeature,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  ResolversTypes,
} from "../schema";
import { ControllerMapper } from "../schema/mappers";

import {
  decodeId,
  decodeOverrideStg,
  encodeOverrideStg,
  enhanceAylaDevice,
  isDevice,
  isOverrideHour,
  OverrideStg,
  setZoneProperty,
  zoneProperty,
} from "../hx";

import { NotSupported, ResolverNotSupported } from "./errors";

const holdLength = ({
  properties,
  zone,
}: ControllerMapper): ResolversTypes["HoldLength"] | null => {
  const overrideSetting = decodeOverrideStg(
    zoneProperty(properties, "OverrideStg", zone)
  );
  switch (overrideSetting.type) {
    case "NextEvent":
      return {
        __typename: "HoldLengthNextEvent",
      };
    case "Hours":
      return {
        __typename: "HoldLengthHours",
        hours: overrideSetting.hours,
      };
    case "Cancelled":
      return {
        __typename: "HoldLengthIndefinite",
      };
    default:
      return null;
  }
};

export const resolver: Resolvers = {
  Controller: {
    defaultHoldLength: (controller) => holdLength(controller),
  },
  FeatureMap: {
    changeDefaultHoldLengthController: () => [
      DefaultHoldLengthFeature.NextEvent,
      DefaultHoldLengthFeature.Hours_12,
      DefaultHoldLengthFeature.Indefinite,
    ],
    changeDefaultHoldLengthLocation: () => null,
  },
  Location: {
    defaultHoldLength: () => null,
  },
};

export const mutationResolver: MutationResolvers = {
  changeDefaultControllerHoldLength: async (
    _,
    { input: { id, nextEvent, hours, indefinite, ...rest } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Must be logged in");
    const { accessToken } = user;

    if (
      Object.values(rest).some((input) => {
        return input !== null;
      })
    ) {
      return NotSupported();
    }

    const { dsn, zone } = decodeId(id);

    const location = await loaders.device.load(dsn);

    if (!isDevice(location)) return { __typename: "NotFound" };

    if (hours || indefinite || nextEvent) {
      let holdLength: OverrideStg = { type: "NextEvent" };
      if (hours) {
        if (!isOverrideHour(hours.hours)) return NotSupported("Invalid Hours");
        holdLength = { type: "Hours", hours: hours.hours };
      } else if (indefinite) {
        holdLength = { type: "Cancelled" };
      }

      await writeDatapoints({
        datapoints: [
          {
            dsn,
            ...setZoneProperty(
              location.properties,
              "OverrideStg",
              zone,
              encodeOverrideStg(holdLength)
            ),
          },
        ],
        accessToken,
      });

      loaders.device.clear(dsn).prime(dsn, enhanceAylaDevice(location));
    }

    return {
      __typename: "ChangeDefaultControllerHoldLengthSuccess",
      controller: { ...location, zone },
    };
  },
  changeDefaultLocationHoldLength: ResolverNotSupported(),
};

export const queryResolver: QueryResolvers = {};
