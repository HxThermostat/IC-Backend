import {
  FaultLog,
  FaultLogLabelAndDescription,
  FaultLogsFeature,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "../schema";

const FAULT_LOGS_LOCATION: FaultLogsFeature | null =
  FaultLogsFeature.LogWithLabelAndDescription;
const FAULT_LOGS_CONTROLLER: FaultLogsFeature | null = null;

export const resolver: Resolvers = {
  FeatureMap: {
    faultLogsLocation: () => FAULT_LOGS_LOCATION,
    faultLogsController: () => FAULT_LOGS_CONTROLLER,
  },
  Controller: {
    faultActive: ({ faultLogs }) => {
      const enabled =
        FAULT_LOGS_CONTROLLER === FaultLogsFeature.LogWithLabel ||
        FAULT_LOGS_CONTROLLER === FaultLogsFeature.LogWithLabelAndDescription;
      if (!enabled || !faultLogs) {
        return null;
      }
      return !!faultLogs.length;
    },
    faultLogs: ({ faultLogs }) =>
      computeFaultLogs(FAULT_LOGS_CONTROLLER, faultLogs),
  },
  Location: {
    faultActive: ({ faultLogs }) => {
      const enabled =
        FAULT_LOGS_LOCATION === FaultLogsFeature.LogWithLabelAndDescription ||
        FAULT_LOGS_LOCATION === FaultLogsFeature.LogWithLabel;
      if (!enabled || !faultLogs) {
        return null;
      }
      return !!faultLogs.length;
    },
    faultLogs: ({ faultLogs }) =>
      computeFaultLogs(FAULT_LOGS_LOCATION, faultLogs),
  },
};

function computeFaultLogs(
  variant: FaultLogsFeature | null,
  faultLogs: FaultLog[] | undefined
): null | FaultLog[] {
  const enabled =
    variant === FaultLogsFeature.LogWithLabel ||
    variant === FaultLogsFeature.LogWithLabelAndDescription;
  if (!enabled || !faultLogs) {
    return null;
  }

  switch (variant) {
    case FaultLogsFeature.LogWithLabel:
      return faultLogs.map((log) => ({
        __typename: "FaultLogLabel",
        date: log.date,
        label: log.label,
      }));
    case FaultLogsFeature.LogWithLabelAndDescription:
      return faultLogs.map((log) => ({
        __typename: "FaultLogLabelAndDescription",
        date: log.date,
        label: log.label,
        description: (log as FaultLogLabelAndDescription).description || "",
      }));
    default:
      return null;
  }
}
export const queryResolver: QueryResolvers = {};
export const mutationResolver: MutationResolvers = {};
