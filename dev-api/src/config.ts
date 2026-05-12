import * as env from "env-var";

export const ENABLE_DATADOG = env
  .get("ENABLE_DATADOG")
  .required(false)
  .default(0)
  .asBool();

export const KLIMATE_FORCE_FIXTURES_SYNC = env
  .get("KLIMATE_FORCE_FIXTURES_SYNC")
  .default(0)
  .required(false)
  .asBool();

export const PORT = env.get("PORT").required(false).default("3000").asInt();

export const REVIEWS_ENABLED = env
  .get("REVIEWS_ENABLED")
  .default(0)
  .required(false)
  .asBool();

export const REVIEW_PROBABILITY = env
  .get("REVIEW_PROBABILITY")
  .default(1)
  .required()
  .asFloatPositive();

export const REVIEW_DELAY_MS = env
  .get("REVIEW_DELAY_MS")
  .default(2 * 7 * 24 * 60 * 60 * 1000)
  .required()
  .asIntPositive();

export const REVIEW_REPROMPT_DELAY_MS = env
  .get("REVIEW_REPROMPT_DELAY_MS")
  .default(6 * 7 * 24 * 60 * 60 * 1000)
  .required()
  .asIntPositive();

// Exclude a few users from reviews
export const REVIEW_SKIP_USER_IDS = new Set(["123"]);

export const SCHEMA_PATH: string = env
  .get("SCHEMA_PATH")
  .default("../graph/schema/**/*.graphql")
  .required()
  .asString();

export const SENDBIRD_API_TOKEN = env
  .get("SENDBIRD_API_TOKEN")
  .default("DEFAULT_SENDBIRD_TOKEN")
  .required()
  .asString();

export const SENDBIRD_APP_ID = env
  .get("SENDBIRD_APP_ID")
  .default("DEFAULT_SENDBIRD_APP_ID")
  .required()
  .asString();

/** (2 weeks) Delay after install date before we prompt */
export const SURVEY_DELAY_MS = env
  .get("SURVEY_DELAY_MS")
  // 2 weeks
  .default(2 * 7 * 24 * 60 * 60 * 1000)
  .required()
  .asIntPositive();

export const SURVEY_PROBABILITY = env
  .get("SURVEY_PROBABILITY")
  .default(0)
  .required(false)
  .asFloatPositive();

/** (6 weeks) Delay before reprompting once a user has been prompted */
export const SURVEY_REPROMPT_DELAY_MS = env
  .get("SURVEY_REPROMPT_DELAY_MS")
  // 6 weeks
  .default(6 * 7 * 24 * 60 * 60 * 1000)
  .required()
  .asIntPositive();

/** (1 day) How long after the last response to show the prompt */
export const SURVEY_RESPONSE_KEEPAROUND_DELAY_MS = env
  .get("SURVEY_RESPONSE_KEEPAROUND_DELAY_MS")
  // 1 day
  .default(1 * 24 * 60 * 60 * 1000)
  .required()
  .asIntPositive();

export const SURVEY_SKIP_USER_IDS = new Set<string>([]);

export const SURVEYS_ENABLED: boolean = env
  .get("SURVEYS_ENABLED")
  .default(0)
  .required(false)
  .asBool();
