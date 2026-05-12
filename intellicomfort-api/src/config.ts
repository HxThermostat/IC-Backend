import * as env from "env-var";

// As a rule of thumb, we want to:
// (1) Type these values manually (e.g. FOO: string or BAR: string | undefined) in order to be explicit about what we intend to export as config
// (2) Use required() even when we're adding a default() in order to get runtime assertions at this level as opposed to hitting a type error further on down the stack

export const IS_PRODUCTION: boolean =
  env.get("NODE_ENV").default("development").asString().toLowerCase() ===
  "production";

export const SCHEMA_PATH: string = env
  .get("SCHEMA_PATH")
  .default("../graph/schema/**/*.graphql")
  .required()
  .asString();

export const BASE_URL: string = env
  .get("BASE_URL")
  .default("https://intellicomfort.kraftful.cloud/")
  .required()
  .asUrlString();

export const AYLA_RULES_SERVICE_WEBHOOK_PATH: string = env
  .get("AYLA_RULES_WEBHOOK_PATH")
  .default("/ars_webhook")
  .required()
  .asString();

export const AYLA_RULES_SERVICE_WEBHOOK_URL = new URL(
  AYLA_RULES_SERVICE_WEBHOOK_PATH,
  BASE_URL
).toString();

export const ENABLE_DATADOG: boolean = env
  .get("ENABLE_DATADOG")
  .default(0)
  .required()
  .asBool();

export const LOG_LEVEL: "debug" | "info" | "error" = env
  .get("LOG_LEVEL")
  .default("info")
  .required()
  .asEnum(["debug", "info", "error"]);

export const PORT: number = env.get("PORT").default("3000").asInt();

export const PUSH_IOS_ARN: string = env
  .get("PUSH_IOS_ARN")
  .required()
  .asString();

export const PUSH_ANDROID_ARN: string = env
  .get("PUSH_ANDROID_ARN")
  .required()
  .asString();

export const PUSH_ARN_BASE: string = env
  .get("PUSH_ARN_BASE")
  .default(PUSH_IOS_ARN)
  .required()
  .asString();

export const REVIEWS_ENABLED: boolean = env
  .get("REVIEWS_ENABLED")
  .default(1)
  .required()
  .asBool();

export const REVIEW_PROBABILITY: number = env
  .get("REVIEW_PROBABILITY")
  .default(0.1)
  .required()
  .asFloatPositive();

export const REVIEW_DELAY_MS: number = env
  .get("REVIEW_DELAY_MS")
  .default(2 * 7 * 24 * 60 * 60 * 1000)
  .required()
  .asIntPositive();

export const REVIEW_MIN_VERSION: string = env
  .get("REVIEW_MIN_VERSION")
  .default("3.1.0")
  .required()
  .asString();

export const REVIEW_REPROMPT_DELAY_MS: number = env
  .get("REVIEW_REPROMPT_DELAY_MS")
  .default(6 * 7 * 24 * 60 * 60 * 1000)
  .required()
  .asIntPositive();

// Allow users to be excluded from review prompts
export const REVIEW_SKIP_USER_IDS = new Set<string>([]);
