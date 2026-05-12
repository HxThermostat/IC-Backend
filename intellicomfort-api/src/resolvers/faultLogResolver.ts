import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  FaultLogsFeature,
  FaultLogLabelAndDescription,
} from "../schema";

import {
  decodeIdCtrlFlt,
  decodeOdCtrlFlt,
  decodeSysStg,
  decodeTstatFlt,
  decodeZnPnlFlt,
  decodeZnSnsrFlt,
} from "../intellicomfort";

export const resolver: Resolvers = {
  FaultLog: {
    __resolveType: (faultLog) => {
      if ((faultLog as FaultLogLabelAndDescription).description != null) {
        return "FaultLogLabelAndDescription";
      }

      return "FaultLogLabel";
    },
  },
  FeatureMap: {
    faultLogsController: () => null,
    faultLogsLocation: () => FaultLogsFeature.LogWithLabelAndDescription,
  },
  Location: {
    faultActive: ({ properties: { ZAnyFlt } }) => !!ZAnyFlt,
    faultLogs: async ({ dsn, properties: { SysStg } }, _, { loaders }) => {
      const { zones } = decodeSysStg(SysStg);

      const indoor = loaders.datapoints.load({
        dsn,
        propertyName: "IDCtrlFlt",
      });
      const outdoor = loaders.datapoints.load({
        dsn,
        propertyName: "ODCtrlFlt",
      });
      const thermostat = loaders.datapoints.load({
        dsn,
        propertyName: "TstatFlt",
      });
      const zonePanel = loaders.datapoints.load({
        dsn,
        propertyName: "ZnPnlFlt",
      });
      const zoneSensor = new Array(zones - 1)
        .fill(0)
        .map((_, i) =>
          loaders.datapoints.load({ dsn, propertyName: `ZnSnsrFlt${i + 2}` })
        );

      return [
        ...(await indoor)
          .filter((datapoint) => datapoint.value !== 0)
          .map((datapoint) => ({
            ...decodeIdCtrlFlt(parseInt(String(datapoint.value))),
            date: datapoint.createdAt.toISOString(),
          })),
        ...(await outdoor)
          .filter((datapoint) => datapoint.value !== 0)
          .map((datapoint) => ({
            ...decodeOdCtrlFlt(parseInt(String(datapoint.value))),
            date: datapoint.createdAt.toISOString(),
          })),
        ...(await thermostat)
          .filter((datapoint) => datapoint.value !== 0)
          .map((datapoint) => ({
            ...decodeTstatFlt(parseInt(String(datapoint.value))),
            date: datapoint.createdAt.toISOString(),
          })),
        ...(await zonePanel)
          .filter((datapoint) => datapoint.value !== 0)
          .map((datapoint) => ({
            ...decodeZnPnlFlt(parseInt(String(datapoint.value))),
            date: datapoint.createdAt.toISOString(),
          })),
        ...(await Promise.all(zoneSensor)).flatMap((datapoints, i) =>
          datapoints
            .filter((datapoint) => datapoint.value !== 0)
            .map((datapoint) => ({
              ...decodeZnSnsrFlt({
                znSnsrFlt: parseInt(String(datapoint.value)),
                zone: i + 2,
              }),
              date: datapoint.createdAt.toISOString(),
            }))
        ),
      ];
    },
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {};
