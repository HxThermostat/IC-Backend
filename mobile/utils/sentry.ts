import { Platform } from "react-native";

import * as SentryExpo from "sentry-expo";
import { RewriteFrames } from "@sentry/integrations";
import { CaptureContext } from "@sentry/types";

import { APP_ID } from "~/config/constants";

export const Sentry = SentryExpo.Native;

export const { addBreadcrumb } = Sentry;

// Stupid hack to tell if the app is running inside of Jest
// https://github.com/getsentry/sentry-react-native/issues/920#issuecomment-641304130
// https://stackoverflow.com/a/52231746
const __JEST__ = process.env.JEST_WORKER_ID !== undefined;

export enum SENTRY_TAG {
  App = "app",
}

export function initSentry(): void {
  SentryExpo.init({
    debug: __DEV__ && !__JEST__,
    dsn:
      "https://50333a18c6f2415c8817f34ee233351a@o419848.ingest.sentry.io/5611081",
    enableInExpoDevelopment: __JEST__,
    enableNative: !__JEST__,
    environment: __DEV__ ? "dev" : "production",
    // The RewriteFrames implementation comes from the sentry-expo docs:
    // https://github.com/expo/expo/blob/e1d296c1a23a1690b4c039ab7afe077bb1acc7b6/docs/pages/guides/using-sentry.md#self-hosting-ota
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          if (frame.filename) {
            // the values depend on what names you give the bundle files you are uploading to Sentry
            frame.filename =
              Platform.OS === "android"
                ? "app:///index.android.bundle"
                : "app:///main.jsbundle";
          }
          return frame;
        },
      }),
    ],
  });

  setTag(SENTRY_TAG.App, APP_ID);
}

export function setSentryUser(user: SentryExpo.Native.User | null): void {
  Sentry.setUser(user);
}

export function captureMessage(message: string): void {
  Sentry.captureMessage(message);
}

export function setTag(tag: SENTRY_TAG, value: string): void {
  Sentry.setTag(tag, value);
}

export function captureException(e: Error, context: CaptureContext = {}): void {
  Sentry.captureException(e, context);
}

export function addNavigationBreadcrumb(
  to: string,
  from?: string | undefined | null
): void {
  Sentry.addBreadcrumb({
    type: "navigation",
    category: "navigation",
    data: {
      to,
      from: from ?? "N/A",
    },
  });
}

export function addExceptionBreadcrumb(e: Error): void {
  addBreadcrumb({
    type: "debug",
    category: "Exception",
    data: {
      name: e.name,
      message: e.message,
    },
  });
}

export function forceSentryCrash(): void {
  Sentry.nativeCrash();
}

interface NotSupported {
  __typename: "NotSupported";
}

interface UnsupportedMutationResult {
  [name: string]: NotSupported;
}

function isNotSupported(obj: unknown): obj is NotSupported {
  if (typeof obj !== "object") return false;
  if (obj == null) return false;

  if (Object.prototype.hasOwnProperty.call(obj, "__typename")) {
    return (obj as NotSupported).__typename === "NotSupported";
  }

  return false;
}

export function logNotSupported(
  mutationResult: UnsupportedMutationResult
): void {
  Object.entries(mutationResult).forEach(([mutationName, value]) => {
    //
    if (isNotSupported(value)) {
      Sentry.captureMessage("Unexpected NotSupported error", {
        tags: {
          mutationName,
        },
      });
    }
  });
}
