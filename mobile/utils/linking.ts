import { Linking, Platform } from "react-native";
import { openInbox } from "react-native-email-link";

import { URI_SCHEME } from "~/config/constants";

import { addExceptionBreadcrumb, captureMessage } from "~/utils/sentry";

export const attemptToOpenURL = (url: string): void => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        void Linking.openURL(url);
      }
      return null;
    })
    .catch((error: Error) => {
      captureMessage(error?.message);
      addExceptionBreadcrumb(error);
    });
};

export function attemptToOpenEmail(): void {
  openInbox().catch(() => {
    // If openInbox() fails, let's just do the next best thing:
    const url = Platform.OS === "android" ? "mailto:" : "message:";
    attemptToOpenURL(url);
  });
}

export function clearLink(): void {
  attemptToOpenURL(`${URI_SCHEME}://nowhere`);
}

export const deepLinkInitialURL = (url: string): void => {
  attemptToOpenURL(
    url.replace(`https://${URI_SCHEME}.kraftful.app/`, `${URI_SCHEME}://`)
  );
};
