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

  const FORCE_HTTPS = process.env.FORCE_HTTPS !== 'false';
  if (IS_PRODUCTION && FORCE_HTTPS) {
    app.use(redirectToHTTPS([], [], 301));
  }

  app.use(express.static(path.join(__dirname, "../static")));

  // Custom landing page for production in Apollo Server 2.x
  if (IS_PRODUCTION) {
    app.get("/", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>IntelliComfort</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #0f1e3f 0%, #1a2f5a 100%); color: #e1e4e8; }
              .container { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
              .content { text-align: center; max-width: 600px; padding: 20px; }
              .logo-img { width: 120px; height: 120px; margin-bottom: 40px; border-radius: 24px; box-shadow: 0 8px 24px rgba(31, 111, 235, 0.3); }
              h1 { font-size: 3rem; margin: 0 0 20px 0; color: #ffffff; font-weight: 700; letter-spacing: -1px; }
              p { font-size: 1.1rem; margin: 15px 0; line-height: 1.6; color: #a8b5c7; }
              .highlight { color: #1f6feb; font-weight: 500; }
              .download-section { margin-top: 50px; }
              .download-buttons { display: flex; gap: 20px; justify-content: center; margin-top: 35px; flex-wrap: wrap; }
              .download-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 32px; background: #1f6feb; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 1rem; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3); border: none; cursor: pointer; }
              .download-btn:hover { background: #388bfd; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(31, 111, 235, 0.4); }
              .download-btn.android { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
              .download-btn.android:hover { background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4); }
              .footer-text { color: #6b7c93; font-size: 0.95rem; margin-top: 60px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="content">
                <img src="${process.env.APP_URL || ''}/app-icon-256.png" alt="IntelliComfort Logo" class="logo-img">
                <h1>IntelliComfort</h1>
                <p>✓ Download our mobile app to get started</p>
                <p style="color: #a8b5c7; margin-top: 15px;">Available on iOS and Android</p>
                
                <div class="download-section">
                  <div class="download-buttons">
                    <a href="https://apps.apple.com/us/app/intellicomfort/id794980960" class="download-btn">
                      Download on iOS
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.jci.thermostat" class="download-btn android">
                      Get it on Android
                    </a>
                  </div>
                </div>
                
                <p class="footer-text">The IntelliComfort API is running smoothly</p>
              </div>
            </div>
          </body>
        </html>
      `);
    });
  }

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