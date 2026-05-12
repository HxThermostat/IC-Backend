import { setContext } from "@apollo/client/link/context";

import { getToken } from "~/utils/auth";
import refresh from "./refreshToken";

const authLink = setContext(async (_, { headers }: { headers: Headers }) => {
  const token = await getToken();
  let accessToken: string | null = null;

  if (token && token.expiresAt > new Date()) {
    ({ accessToken } = token);
  } else if (token && token.expiresAt < new Date()) {
    const newToken = await refresh(token.refreshToken, () => Promise.resolve());
    if (newToken) {
      ({ accessToken } = newToken);
    }
  }

  return {
    headers: {
      ...headers,
      ...{ authorization: accessToken ? `Bearer ${accessToken}` : null },
    },
  };
});

export default authLink;
