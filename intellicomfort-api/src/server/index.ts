import { ApolloServer, AuthenticationError } from "apollo-server-express";

import { isAuthenticationError } from "ayla-client";

import { GraphQLSchema } from "graphql";

import buildSchema from "./schema";
import context, { AppContext } from "./context";
import loaders from "./loaders";
import { metrics } from "./plugins";
import { IS_PRODUCTION } from "../config";

export { buildSchema, context, loaders };

export { default as applyWebhookMiddleware } from "./webhook";

type AppContextFn = typeof context;

export default function buildServer(
  schema: GraphQLSchema,
  context: AppContext | AppContextFn
): ApolloServer {
  return new ApolloServer({
    context,
    formatError: (err) => {
      if (isAuthenticationError(err.originalError)) {
        return new AuthenticationError("Token invalid");
      }
      return err;
    },
    introspection: true,
    plugins: [metrics],
    playground: !IS_PRODUCTION,
    schema,
  });
}
