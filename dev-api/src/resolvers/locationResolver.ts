import {
  ConnectionStatus,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "../schema";
import {
  updateController,
  removeController,
  removeLocation,
} from "../fixtures";

export const resolver: Resolvers = {
  Location: {
    id: ({ id }) => id,
    connectionStatus: ({ connectionStatus }) => {
      switch (connectionStatus) {
        case "ONLINE":
          return ConnectionStatus.Online;
        case "OFFLINE":
          return ConnectionStatus.Offline;
      }
    },
    awayActive: async ({ id }, _, { user, loaders }) => {
      if (!user) return false;

      const controllers = await loaders.controllers.load(user.id);
      return controllers
        .filter((controller) => controller.locationId === id)
        .every((controller) => controller.awayActive);
    },
    lat: ({ lat }) => lat ?? null,
    lng: ({ lng }) => lng ?? null,
    name: ({ name }) => name,
    temperatureOutdoor: ({ temperatureOutdoor }) => temperatureOutdoor ?? null,
    zoning: ({ zoning }) => zoning,
  },
};

export const queryResolver: QueryResolvers = {
  location: async (_root, { id }, { loaders }) => loaders.location.load(id),
  locations: async (_root, _args, { user, loaders }) =>
    user ? loaders.locations.load(user.id) : [],
};

export const mutationResolver: MutationResolvers = {
  removeLocation: async (_root, { input: { id } }, { user, loaders }) => {
    if (!user) {
      return {
        __typename: "NotFound",
      };
    }

    const removed = await removeLocation(id);

    if (removed) {
      await Promise.all(
        removed.controllerIds.map(async (controllerId) => {
          await removeController(controllerId);
          loaders.controller.clear(controllerId);
        })
      );

      loaders.location.clear(id);
      loaders.controllers.clearAll();
      loaders.locations.clearAll();

      return {
        __typename: "RemoveLocationSuccess",
      };
    } else {
      return {
        __typename: "NotFound",
      };
    }
  },
  changeLocationAway: async (
    _root,
    { input: { id, active } },
    { user, loaders }
  ) => {
    if (!user) {
      return {
        __typename: "NotFound",
      };
    }
    const location = await loaders.location.load(id);

    if (!location) {
      return {
        __typename: "NotFound",
      };
    }

    const controllers = await loaders.controllers.load(user.id);

    const locationControllers = controllers.filter((c) =>
      location.controllerIds.includes(c.id)
    );

    for (const controller of locationControllers) {
      if (!controller.supportsAway) {
        continue;
      }
      const updated = await updateController(controller.id, {
        awayActive: active,
      });
      loaders.controller.clear(controller.id).prime(controller.id, updated);
    }

    loaders.controllers.clear(user.id);

    return {
      __typename: "ChangeLocationAwaySuccess",
      location,
    };
  },
};
