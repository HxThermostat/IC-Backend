import DataLoader from "dataloader";

import * as Sentry from "@sentry/node";

import type { Loaders } from ".";

import {
  Endpoint,
  getEndpoint,
  listSubscriptions,
  Subscription,
} from "../../sns";

export function snsEndpointLoader(): Loaders["snsEndpoint"] {
  return new DataLoader(
    async (ids: readonly string[]) => {
      const [id] = ids;

      let endpoint: Endpoint | null;

      try {
        endpoint = (await getEndpoint(id)) ?? null;
      } catch (e) {
        Sentry.captureException(e);
        endpoint = null;
      }

      return [endpoint];
    },
    { batch: false }
  );
}

export function snsSubscriptionsLoader(): Loaders["snsSubscriptions"] {
  return new DataLoader(
    async (ids: readonly string[]) => {
      const [id] = ids;

      let subscriptions: Subscription[];

      try {
        subscriptions = await listSubscriptions(id);
      } catch (e) {
        Sentry.captureException(e);
        subscriptions = [];
      }

      return [subscriptions];
    },
    { batch: false }
  );
}
