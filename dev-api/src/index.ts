import "./tracer";

import * as Sentry from "@sentry/node";
import express from "express";

import { PORT, KLIMATE_FORCE_FIXTURES_SYNC } from "./config";
import buildServer, { buildSchema, context } from "./server";
import { initializeData } from "./data/db";

Sentry.init();

const start = async (): Promise<void> => {
  await initializeData({
    connectionOptions: {
      dialect: "sqlite",
      storage: ".data/fixtures.sqlite",
    },
    forceSync: KLIMATE_FORCE_FIXTURES_SYNC,
    seedData: false,
  });

  const schema = await buildSchema();

  const server = buildServer(schema, context);

  const app = express();

  app.use(Sentry.Handlers.requestHandler());

  server.applyMiddleware({ app, path: "/" });

  app.use(Sentry.Handlers.errorHandler());

  try {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

void start();
