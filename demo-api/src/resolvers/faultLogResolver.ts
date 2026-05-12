import { isAuthenticationError } from "ayla-client";

import { maxBy } from "lodash";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  FaultLogsFeature,
} from "../schema";

import { propagateErrors } from "../utils";

export const resolver: Resolvers = {
  FaultLog: {
    // We've only implemented FaultLogLabel in these resolvers
    __resolveType: () => "FaultLogLabel",
  },
  FaultLogLabel: {
    date: ({ createdAt }) => createdAt.toISOString(),
    label: ({ value }) => String(value),
  },
  FeatureMap: {
    faultLogsController: () => null,
    faultLogsLocation: () => FaultLogsFeature.LogWithLabel,
  },
  Location: {
    faultActive: ({ properties: { Fault } }) => !!Fault,
    faultLogs: async ({ dsn }, _, { loaders }) => {
      // The (recent) history of faults is avaialble as "datapoints"
      // through the Ayla API. When we read the device properties,
      // we're really just getting the most recent datapoint for each
      // property. The previous datapoints are still queryable.
      //
      // That said, it's not _quite_ as simple as just loading up the
      // datapoints for the Faults property and saying "let's go!".
      // The Hx thermostat allows users to clear the faults, and in
      // doing so the thermostat will set the ClrFltLogs property. We
      // use the datetime that the ClrFltLogs was updated to filter
      // out the logs that the user cleared.

      // The propagateErrors helper will re-raise errors that the
      // callback matches. (The bulk DataLoader will catch errors and
      // return them.) In this case, we don't want to swallow HTTP
      // 401s since they'll signal to the client that the access token
      // needs to be refreshed.
      const [faults, cleared] = propagateErrors(
        await loaders.datapoints.loadMany([
          { dsn, propertyName: "Fault" },
          { dsn, propertyName: "ClrFltLogs" },
        ]),
        isAuthenticationError
      );

      let lastCleared: Date | undefined;

      if (Array.isArray(cleared)) {
        lastCleared = maxBy(cleared, ({ createdAt }) => createdAt.getTime())
          ?.createdAt;
      }

      return Array.isArray(faults)
        ? faults.filter(
            (fault) => !lastCleared || lastCleared < fault.createdAt
          )
        : [];
    },
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {};
