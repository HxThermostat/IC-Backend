import { AuthenticationError } from "apollo-server-errors";

import { writeMetadata } from "ayla-client";

import {
  DefaultHoldLengthFeature,
  HoldLength,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "../schema";

import {
  decodeTmpOvr,
  DefaultOverride,
  encodeTmpOvr,
  isDevice,
  setMetadata,
} from "../intellicomfort";

export const resolver: Resolvers = {
  Controller: {
    defaultHoldLength: () => null,
  },
  FeatureMap: {
    changeDefaultHoldLengthController: () => null,
    changeDefaultHoldLengthLocation: () => [
      DefaultHoldLengthFeature.NextEvent,
      DefaultHoldLengthFeature.Indefinite,
      DefaultHoldLengthFeature.Hours_24,
    ],
  },
  Location: {
    defaultHoldLength: ({ metadata: { holdLength } }) =>
      decodeTmpOvr(holdLength ? parseInt(holdLength) : DefaultOverride)
        ?.holdLength ?? null,
  },
};

export const mutationResolver: MutationResolvers = {
  changeDefaultControllerHoldLength: () => {
    return { __typename: "NotSupported" };
  },
  changeDefaultLocationHoldLength: async (
    _,
    { input: { id, nextEvent, indefinite, hours, ...rest } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Must be logged in");

    if (
      Object.values(rest).some((input) => {
        return input !== null;
      })
    ) {
      return { __typename: "NotSupported" };
    }

    const location = await loaders.device.load(id);

    if (!isDevice(location)) return { __typename: "NotFound" };

    if (hours || indefinite || nextEvent) {
      let holdLength: HoldLength;
      if (hours) {
        holdLength = { __typename: "HoldLengthHours", hours: hours.hours };
      } else if (indefinite) {
        holdLength = { __typename: "HoldLengthIndefinite" };
      } else {
        holdLength = { __typename: "HoldLengthNextEvent" };
      }
      await writeMetadata({
        dsn: id,
        ...setMetadata(
          location.metadata,
          "holdLength",
          String(
            encodeTmpOvr({
              setpoint: 0,
              holdLength,
            })
          )
        ),
        accessToken: user.accessToken,
      });

      loaders.device.clear(id).prime(id, location);
    }

    return {
      __typename: "ChangeDefaultLocationHoldLengthSuccess",
      location,
    };
  },
};

export const queryResolver: QueryResolvers = {};
