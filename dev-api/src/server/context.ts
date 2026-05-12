import { AuthenticationError, ExpressContext } from "apollo-server-express";

import { decodeAccessToken, isExpiredError } from "../utils/auth";

import loaders from "./loaders";

export interface User {
  id: string;
}

export interface AppContext {
  user: User | null;
  loaders: ReturnType<typeof loaders>;
}

const BEARER_PREFIX = /^Bearer /i;

export default function context({ req }: ExpressContext): AppContext {
  let user: User | null = null;

  const authorizationHeader = req.headers.authorization || "";

  if (BEARER_PREFIX.exec(authorizationHeader)) {
    const token = authorizationHeader.replace(BEARER_PREFIX, "");

    try {
      const { userId } = decodeAccessToken(token);

      user = {
        id: userId,
      };
    } catch (e) {
      if (isExpiredError(e)) {
        throw new AuthenticationError("Token expired");
      }
    }
  }

  return {
    user,
    loaders: loaders(user?.id),
  };
}
