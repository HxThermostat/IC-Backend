import { AylaRuleTypes, buildRuleName } from "ayla-client";

import express, { Express } from "express";

import * as Sentry from "@sentry/minimal";

import logger from "../logging";

import { deliverNotification } from "../sns";

interface WebhookRequest {
  dsn: string;
  name: string;
  propertyName: string;
  userId: string;
  value: string;
  valueType: string;
}

function isWebhookRequest(request: unknown): request is WebhookRequest {
  if (typeof request !== "object") return false;
  if (request == null) return false;

  const r = request as WebhookRequest;

  return !!(r.name && r.userId);
}

interface TemperatureWebhookRequest extends WebhookRequest {
  controllerId: string;
  locationId: string;
  locationName: string;
}

function isTemperatureWebhookRequest(
  request: WebhookRequest
): request is TemperatureWebhookRequest {
  if (
    request.name !==
    buildRuleName({
      dsn: request.dsn,
      ruleType: AylaRuleTypes.RANGE,
      propertyName: "IdTmp",
    })
  ) {
    return false;
  }

  const r = request as TemperatureWebhookRequest;

  return !!(r.locationId && r.locationName);
}

interface HumidityWebhookRequest extends WebhookRequest {
  controllerId: string;
  locationId: string;
  locationName: string;
}

function isHumidityWebhookRequest(
  request: WebhookRequest
): request is HumidityWebhookRequest {
  if (
    request.name !==
    buildRuleName({
      dsn: request.dsn,
      ruleType: AylaRuleTypes.RANGE,
      propertyName: "Hum",
    })
  ) {
    return false;
  }

  const r = request as HumidityWebhookRequest;

  return !!(r.locationId && r.locationName);
}

interface FaultWebhookRequest extends WebhookRequest {
  locationId: string;
  locationName: string;
}

function isFaultWebhookRequest(
  request: WebhookRequest
): request is FaultWebhookRequest {
  if (
    request.name !==
    buildRuleName({
      dsn: request.dsn,
      ruleType: AylaRuleTypes.CHANGE,
      propertyName: "ZAnyFlt",
    })
  ) {
    return false;
  }

  const r = request as FaultWebhookRequest;

  return !!(r.locationId && r.locationName);
}

async function processWebhook(request: WebhookRequest): Promise<void> {
  Sentry.setExtra("webhookName", request.name);

  logger.info("Processing webhook", request);

  if (isTemperatureWebhookRequest(request)) {
    await deliverNotification(
      request.userId,
      {
        title: `Temperature alert at ${request.locationName}`,
        body: "The indoor temperature is outside of your desired range.",
      },
      {
        type: "TEMPERATURE_NOTIFICATION",
        controllerId: request.controllerId,
        locationId: request.locationId,
      },
      request.name
    );
  } else if (isHumidityWebhookRequest(request)) {
    await deliverNotification(
      request.userId,
      {
        title: `Humidity alert at ${request.locationName}`,
        body: `The humidity is ${request.value}%, which is outside of your desired range.`,
      },
      {
        type: "HUMIDITY_NOTIFICATION",
        controllerId: request.controllerId,
        locationId: request.locationId,
      },
      request.name
    );
  } else if (isFaultWebhookRequest(request) && parseInt(request.value) === 1) {
    await deliverNotification(
      request.userId,
      {
        title: `System fault at ${request.locationName}`,
        body: "Your thermostat is reporting a new fault.",
      },
      {
        type: "FAULT_NOTIFICATION",
        locationId: request.locationId,
      },
      request.name
    );
  } else {
    Sentry.captureMessage("Unprocessable webhook type");
  }
}

interface MiddlewareOptions {
  app: Express;
  path?: string;
}

export default function applyMiddleware({
  app,
  path,
}: MiddlewareOptions): void {
  path = path ?? "/webhook";

  app.use(path, express.json({ strict: false }));
  app.post(path ?? "/webhook", (req, res) => {
    const webhook = isWebhookRequest(req.body) ? req.body : undefined;

    if (!webhook) {
      res.status(404).end();
      return;
    }

    void processWebhook(webhook).finally(() => res.status(201).end());
  });
}
