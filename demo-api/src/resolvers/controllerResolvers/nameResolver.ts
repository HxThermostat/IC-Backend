import { Resolvers, QueryResolvers, MutationResolvers } from "../../schema";
import { zoneProperty } from "../../hx";

export const resolver: Resolvers = {
  Controller: {
    name: ({ metadata, properties, zone }) =>
      zoneProperty(properties, "ZoneName1", zone) ??
      metadata.RoomName ??
      "Living Room",
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  // NOTE: The renameController mutation can be found in renameResolver.ts
};
