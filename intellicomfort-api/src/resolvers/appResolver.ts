import { AuthenticationError } from "apollo-server-express";

import { writeDatapoints } from "ayla-client";

import { compare as compareVersions } from "compare-versions";

import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  AppActiveTrackingFeature,
} from "../schema";

import {
  REVIEW_DELAY_MS,
  REVIEW_PROBABILITY,
  REVIEW_REPROMPT_DELAY_MS,
  REVIEW_SKIP_USER_IDS,
  REVIEWS_ENABLED,
  REVIEW_MIN_VERSION,
} from "../config";

import { isDevice, setProperty, toDSN } from "../intellicomfort";

export const resolver: Resolvers = {
  FeatureMap: {
    appActiveTracking: () => [AppActiveTrackingFeature.Interval_60],
  },
};

export const queryResolver: QueryResolvers = {
  requestRating: (_root, { input }, { user }) => {
    try {
      if (!REVIEWS_ENABLED) return false;

      if (Math.random() >= REVIEW_PROBABILITY) return false;

      if (!user || REVIEW_SKIP_USER_IDS.has(user.id)) return false;

      if (!input) return false;

      if (compareVersions(input.version, REVIEW_MIN_VERSION, "<")) return false;

      const installedAt = new Date(input.installedAt);
      const lastDisplayedAt = input?.lastDisplayedAt
        ? new Date(input?.lastDisplayedAt)
        : undefined;

      // Don't allow for fresh installs
      if (Date.now() - installedAt.getTime() < REVIEW_DELAY_MS) return false;

      // Allow when prompts have never been displayed
      if (lastDisplayedAt == null) return true;

      return Date.now() - lastDisplayedAt.getTime() >= REVIEW_REPROMPT_DELAY_MS;
    } catch {
      // Better to be a bit defensive with parse errors in case of a
      // client error always providing invalid values, etc
      return false;
    }
  },
  requestSurveyFeedback: () => false,
  updateRequired: () => null,
};

export const mutationResolver: MutationResolvers = {
  setAppActive: async (
    _,
    { input: { controllerId, locationId } },
    { user, loaders }
  ) => {
    if (!user) throw new AuthenticationError("Must be logged in");

    const dsn = locationId ?? (controllerId ? toDSN(controllerId) : undefined);

    const location = dsn ? await loaders.device.load(dsn) : undefined;

    if (!isDevice(location)) return { __typename: "NotFound" };

    try {
      await writeDatapoints({
        datapoints: {
          dsn: location.dsn,
          ...setProperty(location.properties, "Con2ACS", 1),
        },
        accessToken: user.accessToken,
      });
    } catch {
      return { __typename: "NotFound" };
    }

    return {
      __typename: "SetAppActiveSuccess",
    };
  },
};
