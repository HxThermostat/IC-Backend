import * as env from "env-var";

export const AYLA_APP_ID = env.get("AYLA_APP_ID").required(true).asString();

export const AYLA_APP_SECRET = env
  .get("AYLA_APP_SECRET")
  .required(true)
  .asString();
