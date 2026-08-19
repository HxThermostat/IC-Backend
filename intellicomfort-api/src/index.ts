import "./tracer";
import path from "path";

import * as Sentry from "@sentry/node";

import compression from "compression";
import express from "express";
import { redirectToHTTPS } from "express-http-to-https";

import { AYLA_RULES_SERVICE_WEBHOOK_PATH, IS_PRODUCTION, PORT } from "./config";
import buildServer, {
  applyWebhookMiddleware,
  buildSchema,
  context,
} from "./server";

import logger from "./logging";

Sentry.init();

const start = async (): Promise<void> => {
  const schema = await buildSchema();

  const server = buildServer(schema, context);

  const app = express();

  app.use(Sentry.Handlers.requestHandler());

  app.use(compression());

  if (IS_PRODUCTION) {
    app.use(redirectToHTTPS([], [], 301));
  }

  app.use(express.static(path.join(__dirname, "../static")));

  applyWebhookMiddleware({ app, path: AYLA_RULES_SERVICE_WEBHOOK_PATH });
  server.applyMiddleware({ app, path: "/" });

  app.use(Sentry.Handlers.errorHandler());

  try {
    app.listen(PORT, () => {
      logger.info(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

void start();