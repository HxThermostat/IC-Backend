import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import { ControllerRecord } from "../../fixtures/controller";

function computeFanActiveSpeedName(controller: ControllerRecord): string {
  const setTemp =
    controller.setpointType === "SingleSetpoint"
      ? controller.setpointTarget ?? 0
      : ((controller.setpointLower ?? 0) + (controller.setpointUpper ?? 0)) / 2;

  if (setTemp < 10) {
    return "LOW";
  } else if (setTemp < 20) {
    return "MEDIUM";
  }

  return "HIGH";
}

export const resolver: Resolvers = {
  Controller: {
    fan: (controller) => ({
      __typename: "SpeedNameFan",
      activeSpeedName: computeFanActiveSpeedName(controller),
      running: true,
    }),
  },
};

export const queryResolver: QueryResolvers = {};
export const mutationResolver: MutationResolvers = {};
