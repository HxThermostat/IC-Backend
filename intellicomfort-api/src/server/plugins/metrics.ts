import { ApolloServerPlugin } from "apollo-server-plugin-base";

import statsd from "../../stats";

type WithTypename = { __typename: string };

function hasTypename(field: unknown): field is WithTypename {
  if (typeof field !== "object") return false;
  if (!field) return false;

  return "__typename" in field;
}

const plugin: ApolloServerPlugin = {
  requestDidStart() {
    statsd.increment("graphql.apollo.requestDidStart");

    return {
      didResolveOperation({ operation, operationName }) {
        statsd.increment("graphql.apollo.operationResolved", 1, undefined, {
          operation: operation.operation,
          operationName: operationName ?? "__anonymous__",
        });
      },
      parsingDidStart() {
        const start = new Date();

        return () => {
          statsd.timing("graphql.apollo.parse.timer", start);
        };
      },
      executionDidStart() {
        const start = new Date();

        return () => {
          statsd.timing("graphql.apollo.execute.timer", start);
        };
      },
      didEncounterErrors() {
        statsd.increment("graphql.apollo.didEncounterErrors");
      },
      willSendResponse({ errors, operation, operationName, response }) {
        const tags: Record<string, string> = {
          errors: String(errors?.length ?? 0),
        };

        // The operation will be available for requests that were
        // successfully parsed
        if (operation?.operation) {
          tags["operation"] = operation.operation;
          tags["operationName"] = operationName ?? "__anonymous__";

          // Mutation requests will return a single typename in the
          // response which we can extract
          if (operation.operation === "mutation" && response.data) {
            let typename: string | undefined;

            for (const key in response.data) {
              const field: unknown = response.data[key];

              if (hasTypename(field)) {
                typename = field.__typename;
                break;
              }
            }

            if (typename) {
              tags["typename"] = typename;
            }
          }
        }

        statsd.increment("graphql.apollo.willSendResponse", 1, undefined, tags);
      },
    };
  },
};

export default plugin;
