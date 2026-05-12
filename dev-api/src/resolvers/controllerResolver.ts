import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  Call,
  EffectiveMode,
} from "../schema";

export const resolver: Resolvers = {
  Controller: {
    id: ({ id }) => id,
    call: (controller) => {
      const { mode } = controller;

      if (mode === "OFF") return null;

      if (controller.setpointType === "SingleSetpoint") {
        switch (mode) {
          case EffectiveMode.Heat:
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return controller.setpointTarget! % 2 ? Call.Heat : null;
          case EffectiveMode.Cool:
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return controller.setpointTarget! % 2 ? Call.Cool : null;
          // do something if auto?
          default:
            return null;
        }
      } else {
        const randomizedValue =
          Math.floor(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (controller.setpointLower! + controller.setpointUpper!) / 2
          ) % 3;
        switch (randomizedValue) {
          case 0:
            return null;
          case 1:
            return Call.Heat;
          case 2:
            return Call.Cool;
          default:
            return null;
        }
      }
    },
    humidityAmbient: ({ humidityAmbient }) => humidityAmbient ?? null,
    location: async ({ locationId }, _, { loaders }) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (await loaders.location.load(locationId))!,
    name: ({ name }) => name,
    temperatureAmbient: (controller) => {
      return controller.setpointType === "SingleSetpoint"
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          controller.setpointTarget!
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (controller.setpointLower! + controller.setpointUpper!) / 2;
    },
    zoning: async ({ locationId }, _, { loaders }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const location = await loaders.location.load(locationId);

      return location?.zoning ?? false;
    },
  },
  Location: {
    controller: async ({ id }, _, { user, loaders }) => {
      if (!user) return null;

      const controllers = await loaders.controllers.load(user?.id);
      const matches = controllers.filter(
        (controller) => controller.locationId === id
      );
      return matches.length === 1 ? matches[0] : null;
    },
    controllers: async ({ id }, _, { user, loaders }) => {
      if (!user) return [];

      const controllers = await loaders.controllers.load(user.id);
      return controllers.filter((controller) => controller.locationId === id);
    },
  },
};

export const queryResolver: QueryResolvers = {
  controller: async (_root, { id }, { loaders }) => loaders.controller.load(id),
  controllers: async (_root, _args, { user, loaders }) =>
    user ? loaders.controllers.load(user.id) : [],
};
export const mutationResolver: MutationResolvers = {};
