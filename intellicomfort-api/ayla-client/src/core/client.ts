import got, { ExtendOptions, Got, HTTPError, RequestError } from "got";

export type TokenContext = {
  accessToken: string;
};

const base = got.extend({
  decompress: true,
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "user-agent": "klimate/1.0.0",
  },
});

const withAuth = got.extend({
  handlers: [
    (options, next) => {
      const accessToken = options.context["accessToken"];
      if (typeof accessToken === "string") {
        options.headers["authorization"] = `auth_token ${accessToken}`;
      }

      return next(options);
    },
  ],
});

const withTimeout = got.extend({
  handlers: [
    (options, next) => {
      const request = options.context["timeout"];

      if (typeof request === "number") {
        options.timeout = { request };
      } else {
        options.timeout = { request: 5000 };
      }

      return next(options);
    },
  ],
});

const buildClient = (...options: ExtendOptions[]): Got =>
  got.extend(base, withAuth, withTimeout, ...options);

export default buildClient;

export const isRequestError = (e: unknown): e is RequestError =>
  e instanceof RequestError;

export const isHTTPError = (e: unknown): e is HTTPError =>
  e instanceof HTTPError;

export const hasStatusCode = (e: unknown, statusCode: number): boolean =>
  isHTTPError(e) && e.response.statusCode === statusCode;

export const isAuthenticationError = (e: unknown): e is HTTPError =>
  hasStatusCode(e, 401);
