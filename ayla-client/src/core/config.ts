import * as env from "env-var";

export const AYLA_DEVICE_SERVICE_URL = env
  .get("AYLA_DEVICE_SERVICE_URL")
  .default("https://ads-field.aylanetworks.com")
  .asUrlString();

export const AYLA_RULE_SERVICE_URL = env
  .get("AYLA_RULE_SERVICE_URL")
  .default("https://rulesservice-field.aylanetworks.com")
  .asUrlString();

export const AYLA_USER_SERVICE_URL = env
  .get("AYLA_USER_SERVICE_URL")
  .default("https://user-field.aylanetworks.com")
  .asUrlString();
