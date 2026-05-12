import * as env from "env-var";

export const JWT_SIG_KEY = env.get("JWT_SIG_KEY").required(true).asString();

export const JWT_ENCRYPT_KEY = env
  .get("JWT_ENCRYPT_KEY")
  .required(true)
  .asString();

export const JWT_ISSUER = "kraftful";
