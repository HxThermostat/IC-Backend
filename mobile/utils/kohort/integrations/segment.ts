import { JsonMap, createClient, Plugin } from "@segment/analytics-react-native";
import { PixelRatio, Platform } from "react-native";

import { appVersion, nativeVersion } from "~/utils/version";

// Segment doesn't export the SegmentClient type so we have to get it in a roundabout way.
export type SegmentClientLocal = ReturnType<typeof createClient>;

let client: SegmentClientLocal | undefined = undefined;
export const initializeSegmentAsync = (writeKey: string): void => {
  client = createClient({
    writeKey,
    trackAppLifecycleEvents: true,
    flushAt: 1,
  });

  void client.init();
};

export const setupSegment = (writeKey: string): void => {
  initializeSegmentAsync(writeKey);
};

// A wrapper for accessing the initialized client in a safe way
const withAnalytics = (cb: (analytics: SegmentClientLocal) => void): void => {
  if (client != null) cb(client);
};

export const trackSegmentScreen = (
  name: string,
  properties?: JsonMap
): void => {
  withAnalytics((analytics) => {
    analytics.screen(name, properties);
  });
};

export const identifySegmentUser = (
  userId: string,
  customTraits: JsonMap
): void => {
  const traits = {
    ...customTraits,
    appVersion,
    nativeVersion,
    fontScale: PixelRatio.getFontScale(),
  };
  withAnalytics((analytics) => {
    if (!userId) {
      const userInfo = analytics.userInfo.get();
      analytics.identify(userInfo.anonymousId, traits);
    } else {
      analytics.identify(userId, traits);
    }
  });
};

export const resetSegmentForUser = (): void => {
  withAnalytics((analytics) => {
    analytics.reset();
  });
};

export const trackSegmentEvent = (
  eventName: string,
  properties?: JsonMap
): void => {
  withAnalytics((analytics) => {
    analytics.track(eventName, properties);
  });
};

export const trackSegmentEventIOS: typeof trackSegmentEvent = (
  ...args: Parameters<typeof trackSegmentEvent>
) => {
  if (Platform.OS !== "ios") return;

  trackSegmentEvent(...args);
};

export const trackSegmentEventAndroid: typeof trackSegmentEvent = (
  ...args: Parameters<typeof trackSegmentEvent>
) => {
  if (Platform.OS !== "android") return;

  trackSegmentEvent(...args);
};

export function addPlugin<TPlugin extends Plugin>(plugin: TPlugin): void {
  withAnalytics((analytics) => {
    analytics.add({ plugin });
  });
}
