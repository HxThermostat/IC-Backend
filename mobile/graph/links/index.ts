import { ApolloLink } from "@apollo/client";

import authLink from "./authLink";
import eventTrackingLink from "./eventTrackingLink";
import buildHttpLink from "./httpLink";
import retryLink from "./retryLink";
import buildRefreshTokenLink from "./refreshTokenLink";
import sentryLink from "./sentryLink";
import timeoutLink from "./timeoutLink";

const wrapLink = (link: ApolloLink): ApolloLink =>
  sentryLink.concat(eventTrackingLink.concat(link));

export const buildLink = (
  handleRefreshError?: () => Promise<void>,
  graphUrl?: string
): ApolloLink => {
  const baseLink = retryLink.concat(
    timeoutLink.concat(buildHttpLink(graphUrl))
  );

  if (!handleRefreshError) {
    return wrapLink(baseLink);
  }

  return wrapLink(
    buildRefreshTokenLink(handleRefreshError).concat(authLink.concat(baseLink))
  );
};
