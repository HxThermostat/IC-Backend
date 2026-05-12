import { AppState, AppStateStatus } from "react-native";

import * as Updates from "expo-updates";

import { captureException } from "~/utils/sentry";

import { trackSegmentEvent } from "~/utils/kohort";

let updateAvailable = false;

export const initUpdates = (): void => {
  if (__DEV__) return;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  AppState.addEventListener("change", async (appState: AppStateStatus) => {
    if (appState === "active") {
      let isAvailable: boolean;
      try {
        ({ isAvailable } = await Updates.checkForUpdateAsync());
      } catch (e) {
        captureException(e);
        isAvailable = false;
      }

      if (isAvailable) {
        trackSegmentEvent("Update available");
        try {
          await Updates.fetchUpdateAsync();
          updateAvailable = true;
          trackSegmentEvent("Update downloaded");
        } catch (e) {
          captureException(e);
        }
      }
    }

    if (appState === "background") {
      try {
        if (updateAvailable) {
          trackSegmentEvent("Reloading with update");
          await Updates.reloadAsync();
        }
      } catch (e) {
        captureException(e);
      }
    }
  });
};

export const reloadIfAvailable = async (): Promise<void> => {
  if (__DEV__) return;

  try {
    const { isAvailable } = await Updates.checkForUpdateAsync();

    if (!isAvailable) return;

    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  } catch (e) {
    captureException(e);
  }
};
