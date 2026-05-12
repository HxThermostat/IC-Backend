import * as env from "env-var";

export const JWT_SIG_KEY = env.get("JWT_SIG_KEY").required().asString();

export const JWT_ENCRYPT_KEY = env.get("JWT_ENCRYPT_KEY").required().asString();

export const JWT_ISSUER = "kraftful";

export const PASSWORD_SALT = env.get("PASSWORD_SALT").required().asString();

export const PASSWORD_LENGTH = 8;
