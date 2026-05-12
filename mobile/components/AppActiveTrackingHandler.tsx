import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";

import { useAppState, useController, useFeatureFlags } from "~/contexts";

import { AppState, useSetAppActiveMutation } from "~/graph";

type Interval = 60000;

const AppActiveTrackingHandler = (): JSX.Element => {
  // We're keeping the appState in a ref so that we can reference the
  // current value without re-triggering the useEffect hook when the
  // value changes. It varies by OS, but the appState can change more
  // than expected (e.g. when a system-modal UI Is presented, the app
  // is no longer "active"). Currently, we don't have any use-cases
  // for the appState value would be time-critical, so we're happy to
  // just ignore the potentially-noisy state transitions.
  const appState = useAppState();
  const appStateRef = useRef(appState);
  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

  const { controllerId, locationId } = useController();

  const { handleEnabledFeature } = useFeatureFlags();

  const [setAppActive] = useSetAppActiveMutation();

  const track = useCallback(
    ({
      controllerId,
      locationId,
    }: {
      controllerId: string;
      locationId: string;
    }) => {
      let appState: AppState;
      switch (appStateRef.current) {
        case "active":
          appState = "FOREGROUND";
          break;
        case "background":
          appState = "BACKGROUND";
          break;
        default:
          appState = "UNKNOWN";
      }

      void setAppActive({ variables: { appState, controllerId, locationId } });
    },
    [setAppActive]
  );

  const interval: Interval | undefined =
    handleEnabledFeature("appActiveTracking", (variants) => {
      if (variants.includes("INTERVAL_60")) {
        return 60000;
      }
    }) ?? undefined;

  useEffect(() => {
    if (interval == null) return;

    track({ controllerId, locationId });

    const handle = setInterval(track, interval, { controllerId, locationId });

    return () => clearInterval(handle);
  }, [controllerId, interval, locationId, track]);

  return <View />;
};

export default AppActiveTrackingHandler;
