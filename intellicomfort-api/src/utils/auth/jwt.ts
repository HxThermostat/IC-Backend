import { JWT, JWE, JWK, errors } from "jose";

import { JWT_ENCRYPT_KEY, JWT_ISSUER, JWT_SIG_KEY } from "./config";

const sigKey = JWK.asKey(JWT_SIG_KEY);
const encryptKey = JWK.asKey(JWT_ENCRYPT_KEY);

export interface GenericPayload {
  userId: string;
}

export function isGenericPayload(payload: unknown): payload is GenericPayload {
  if (typeof payload !== "object") return false;
  if (!payload) return false;

  return "userId" in payload;
}

export const create = <T extends GenericPayload>(
  payload: T,
  iss: string,
  expiresIn = "1d"
): string => {
  const token = JWT.sign(payload, sigKey, {
    subject: payload.userId,
    expiresIn: expiresIn,
    issuer: `${JWT_ISSUER}.${iss}`,
  });

  return JWE.encrypt(token, encryptKey);
};

export const decode = <T extends GenericPayload>(
  jwe: string,
  iss: string,
  valid: (payload: GenericPayload) => payload is T
): T => {
  const token = JWE.decrypt(jwe, encryptKey);

  const payload = JWT.verify(token.toString("utf8"), sigKey, {
    issuer: `${JWT_ISSUER}.${iss}`,
  });

  if (!isGenericPayload(payload)) throw new errors.JWTMalformed();
  if (!valid(payload)) throw new errors.JWTMalformed();

  return payload;
};

export const isExpiredError = (error: unknown): error is errors.JWTExpired => {
  if (!(error instanceof Error)) return false;
  return (error as errors.JWTExpired).code === "ERR_JWT_EXPIRED";
};

// AccessToken

type AccessTokenPayload = GenericPayload & {
  accessToken: string;
};

function isAccessTokenPayload(
  payload: GenericPayload
): payload is AccessTokenPayload {
  return typeof (payload as AccessTokenPayload).accessToken === "string";
}

export const createAccessToken = (
  payload: AccessTokenPayload,
  expiresIn: string
): string => create(payload, "access", expiresIn);

export const decodeAccessToken = (jwe: string): AccessTokenPayload =>
  decode(jwe, "access", isAccessTokenPayload);

// RefreshToken

type RefreshTokenPayload = GenericPayload & {
  email: string;
  ksid: string;
  refreshToken: string;
};

function isRefreshTokenPayload(
  payload: GenericPayload
): payload is RefreshTokenPayload {
  return (
    typeof (payload as RefreshTokenPayload).ksid === "string" &&
    typeof (payload as RefreshTokenPayload).refreshToken === "string"
  );
}

export const createRefreshToken = (
  payload: RefreshTokenPayload,
  expiresIn: string
): string => create(payload, "refresh", expiresIn);
export const decodeRefreshToken = (jwe: string): RefreshTokenPayload =>
  decode(jwe, "refresh", isRefreshTokenPayload);
