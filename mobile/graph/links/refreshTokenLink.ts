import { Observable, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { getToken } from "~/utils/auth";

import refresh from "./refreshToken";

const buildLink = (handleError?: () => Promise<void>): ApolloLink => {
  return ApolloLink.from([
    onError(({ graphQLErrors, operation, forward }) => {
      if (
        !graphQLErrors?.find(
          (error) => error.extensions?.code === "UNAUTHENTICATED"
        )
      ) {
        return;
      }

      return new Observable((observer) => {
        void (async () => {
          try {
            const token = await getToken();

            if (token && token.refreshToken) {
              await refresh(token.refreshToken, handleError);
            }
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          } catch (error) {
            observer.error(error);
          }
        })();
      });
    }),
  ]);
};

export default buildLink;
