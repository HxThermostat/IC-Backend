import {
  DefaultHoldLengthFeature,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  ResolversTypes,
} from "../schema";

import { ControllerRecord, updateController } from "../fixtures";

const supportedHoldLengths = [
  DefaultHoldLengthFeature.Indefinite,
  DefaultHoldLengthFeature.NextEvent,
  DefaultHoldLengthFeature.Hours_24,
];

const holdLength = (
  controller: ControllerRecord
): ResolversTypes["HoldLength"] | null => {
  switch (controller.holdLengthType) {
    case "Indefinite":
      return {
        __typename: "HoldLengthIndefinite",
      };
    case "NextEvent":
      return {
        __typename: "HoldLengthNextEvent",
      };
    case "Hours":
      return {
        __typename: "HoldLengthHours",
        hours: controller.holdLengthHours,
      };
    case "Date":
      return {
        __typename: "HoldLengthDate",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        date: controller.holdLengthDate!,
      };
    case "NotSupported":
    default:
      return null;
  }
};

export const resolver: Resolvers = {
  Controller: {
    defaultHoldLength: (controller) => holdLength(controller),
  },
  FeatureMap: {
    changeDefaultHoldLengthController: () => null,
    changeDefaultHoldLengthLocation: () => supportedHoldLengths,
  },
  Location: {
    defaultHoldLength: async (location, _, { loaders }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const controller = (await loaders.controller.load(
        location.controllerIds[0]
      ))!;

      return holdLength(controller);
    },
  },
};

export const mutationResolver: MutationResolvers = {
  changeDefaultControllerHoldLength: async (
    _,
    { input: { id, ...input } },
    { loaders }
  ) => {
    const controller = await loaders.controller.load(id);

    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }
    // Don't set any value if holdLength is not supported or
    // the controller doesn't support holdLength
    if (
      supportedHoldLengths.length === 0 ||
      controller.holdLengthType === "NotSupported"
    ) {
      return {
        __typename: "NotSupported",
      };
    }

    // If input only has an id then do nothing and return the current controller
    if (Object.keys(input).length === 0) {
      return {
        __typename: "ChangeDefaultControllerHoldLengthSuccess",
        controller,
      };
    }

    let change: Partial<ControllerRecord> = {};
    for (const holdLength of supportedHoldLengths) {
      switch (holdLength) {
        case "INDEFINITE":
          if (input.indefinite) {
            change.holdLengthType = "Indefinite";
          }
          break;
        case "NEXT_EVENT":
          if (input.nextEvent) {
            change.holdLengthType = "NextEvent";
          }
          break;
        case "HOURS_24":
          if (input.hours) {
            change = {
              holdLengthType: "Hours",
              holdLengthHours: Math.min(Math.max(1, input.hours.hours), 24),
            };
          }
          break;
        case "DATE":
          if (input.date) {
            change = {
              holdLengthType: "Date",
              holdLengthDate: input.date.date,
            };
          }
          break;
      }
    }

    // If we didn't set any keys in change we know we only received unsupported input(s)
    if (Object.keys(change).length === 0) {
      return { __typename: "NotSupported" };
    }

    // Update controller
    const updated = await updateController(id, change);
    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();
    return {
      __typename: "ChangeDefaultControllerHoldLengthSuccess",
      controller: updated,
    };
  },
  changeDefaultLocationHoldLength: async (
    _,
    { input: { id, ...input } },
    { loaders, user }
  ) => {
    const location = await loaders.location.load(id);

    if (!location) {
      return {
        __typename: "NotFound",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const controller = (await loaders.controller.load(
      location.controllerIds[0]
    ))!;

    // Don't set any value if holdLength is not supported or
    // the controller doesn't support holdLength
    if (
      supportedHoldLengths.length === 0 ||
      controller.holdLengthType === "NotSupported"
    ) {
      return {
        __typename: "NotSupported",
      };
    }

    // If input only has an id then do nothing and return the current controller
    if (Object.keys(input).length === 0) {
      return {
        __typename: "ChangeDefaultLocationHoldLengthSuccess",
        location,
      };
    }

    let change: Partial<ControllerRecord> = {};
    for (const holdLength of supportedHoldLengths) {
      switch (holdLength) {
        case "INDEFINITE":
          if (input.indefinite) {
            change.holdLengthType = "Indefinite";
          }
          break;
        case "NEXT_EVENT":
          if (input.nextEvent) {
            change.holdLengthType = "NextEvent";
          }
          break;
        case "HOURS_24":
          if (input.hours) {
            change = {
              holdLengthType: "Hours",
              holdLengthHours: Math.min(Math.max(1, input.hours.hours), 24),
            };
          }
          break;
        case "DATE":
          if (input.date) {
            change = {
              holdLengthType: "Date",
              holdLengthDate: input.date.date,
            };
          }
          break;
      }
    }

    // If we didn't set any keys in change we know we only received unsupported input(s)
    if (Object.keys(change).length === 0) {
      return { __typename: "NotSupported" };
    }

    // Update controller
    await Promise.all(
      location.controllerIds.map(async (controllerId) => {
        const updated = await updateController(controllerId, change);
        loaders.controller.clear(controllerId).prime(controllerId, updated);
      })
    );

    loaders.location.clear(id);

    if (user) loaders.controllers.clear(user.id);

    return {
      __typename: "ChangeDefaultLocationHoldLengthSuccess",
      location: location,
    };
  },
};

export const queryResolver: QueryResolvers = {};
