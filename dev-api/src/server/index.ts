import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";

import buildSchema from "./schema";
import context, { AppContext } from "./context";
import loaders from "./loaders";
import { metrics } from "./plugins";

export { buildSchema, context, loaders };

type AppContextFn = typeof context;

export default function buildServer(
  schema: GraphQLSchema,
  context: AppContext | AppContextFn
): ApolloServer {
  return new ApolloServer({
    schema,
    context,
    plugins: [metrics],
    playground: true,
    introspection: true,
  });
}
