import { ApolloClient, InMemoryCache } from "@apollo/client";

import {
  RefreshTokenDocument,
  RefreshTokenMutation,
  RefreshTokenMutationVariables,
} from "~/graph/schema";

import buildHttpLink from "./httpLink";
import { handleRefresh, Token } from "~/utils/auth";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: buildHttpLink(),
});

const RETRIES = 3;
const DELAY_MS = 100;
const MAX_DELAY_MS = 8000;

const refreshMutation = async (
  token: string
): Promise<Token | "TokenInvalid" | null> => {
  const { data } = await client.mutate<
    RefreshTokenMutation,
    RefreshTokenMutationVariables
  >({
    mutation: RefreshTokenDocument,
    variables: { input: { token: token } },
  });

  if (!data) return null;

  const { refreshToken } = data;

  switch (refreshToken.__typename) {
    case "RefreshTokenSuccess":
      return {
        ...refreshToken,
        expiresAt: new Date(Date.now() + refreshToken.ttl * 1000),
      };
    default:
      return refreshToken.__typename;
  }
};

const refresh = async (
  token: string,
  onError?: () => Promise<void>
): Promise<Token | null> => {
  let result: Token | null = null;

  for (let r = 0; r < RETRIES; r++) {
    result = await handleRefresh(() => refreshMutation(token));

    if (result) break;

    // Simple exponential backoff with jitter
    // https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
    const sleep = Math.random() * Math.min(MAX_DELAY_MS, DELAY_MS * 8 ** r);
    await new Promise((resolve) => setTimeout(resolve, sleep));
  }

  if (!result && onError) await onError();

  return result;
};

export default refresh;
