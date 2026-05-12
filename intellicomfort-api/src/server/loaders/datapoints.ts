import { AylaDatapoint, datapoints as getDatapoints } from "ayla-client";

import DataLoader from "dataloader";

import * as Sentry from "@sentry/node";

import type { Loaders } from ".";

export function datapointsLoader(accessToken?: string): Loaders["datapoints"] {
  return new DataLoader(
    async (ids: readonly { dsn: string; propertyName: string }[]) => {
      const [{ dsn, propertyName }] = ids;

      if (!accessToken) {
        return [[]];
      }

      let datapoints: AylaDatapoint[];

      try {
        datapoints = await getDatapoints({ dsn, propertyName, accessToken });
      } catch (e) {
        Sentry.captureException(e);
        datapoints = [];
      }

      return [datapoints];
    },
    { batch: false }
  );
}
