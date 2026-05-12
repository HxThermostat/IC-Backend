import { AuthenticationError } from "apollo-server-express";
import { writeDatapoints } from "ayla-client";

import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import {
  decodeId,
  decodeTmpOvr,
  isDevice,
  isProgrammable,
  setZoneProperty,
  zoneProperty,
} from "../../intellicomfort";

export const resolver: Resolvers = {
  Controller: {
    activeHold: ({ properties, zone }) => {
      if (!isProgrammable(properties.ViewMd)) return null;

      return (
        decodeTmpOvr(zoneProperty(properties, "TmpOvr1", zone))?.holdLength ??
        null
      );
    },
  },
};

export const mutationResolver: MutationResolvers = {
  cancelHold: async (_, { input: { id } }, { loaders, user }) => {
    if (!user) throw new AuthenticationError("Must be logged in");

    const { dsn, zone } = decodeId(id);

    const controller = await loaders.device.load(dsn);

    if (!isDevice(controller)) return { __typename: "NotFound" };

    await writeDatapoints({
      datapoints: {
        dsn,
        ...setZoneProperty(controller.properties, "TmpOvr1", zone, 0),
      },
      accessToken: user.accessToken,
    });

    return {
      __typename: "CancelHoldSuccess",
      controller: { ...controller, zone },
    };
  },
};

export const queryResolver: QueryResolvers = {};
