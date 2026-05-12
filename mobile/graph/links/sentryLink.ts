import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { addBreadcrumb, Sentry } from "~/utils/sentry";

const queryLogger = new ApolloLink((operation, forward) => {
  const { operationName, query } = operation;
  const definition = query.definitions[0];

  const breadcrumb = {
    type: "query",
    level: Sentry.Severity.Info,
    data: {
      name: operationName,
      kind:
        definition.kind === "OperationDefinition"
          ? definition.operation
          : "Unknown",
    },
  };

  addBreadcrumb({ ...breadcrumb, category: "started" });

  return forward(operation).map((data) => {
    addBreadcrumb({ ...breadcrumb, category: "finished" });

    return data;
  });
});

const errorLogger = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, path }) =>
      addBreadcrumb({
        type: "query",
        level: Sentry.Severity.Error,
        category: "GraphQL Error",
        data: {
          message,
          path,
        },
      })
    );

  if (networkError) {
    addBreadcrumb({
      type: "query",
      level: Sentry.Severity.Error,
      category: "Network Error",
    });
  }
});

const sentryLink = errorLogger.concat(queryLogger);

export default sentryLink;
