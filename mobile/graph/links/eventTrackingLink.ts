import { ApolloLink } from "@apollo/client";

import { trackSegmentEvent } from "~/utils/kohort";

type OperationResultData = {
  [key: string]: {
    [key: string]: {
      __typename: string;
      [key: string]: unknown;
    };
  };
};

const eventTrackingLink = new ApolloLink((operation, forward) => {
  const { operationName, query } = operation;

  const queryHasMutation = query.definitions.some(
    (def) => def.kind === "OperationDefinition" && def.operation === "mutation"
  );

  return forward(operation).map((data) => {
    // For now we're only tracking mutation operations
    if (!queryHasMutation) return data;

    const { data: resultData } = data as OperationResultData;

    // we can't easily detect what the __typename is, but we can loop
    // through the response data object and find it.
    let typename = "";
    for (const key in resultData) {
      if (resultData[key] && resultData[key]?.__typename) {
        typename = resultData[key]?.__typename;
      }
    }

    trackSegmentEvent("GraphQL Mutation", {
      operationName,
      __typename: typename,
    });

    return data;
  });
});

export default eventTrackingLink;
