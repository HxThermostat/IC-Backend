import { useEffect } from "react";

import { Alert, Linking, Platform } from "react-native";

import { ApolloClient, useApolloClient } from "@apollo/client";

import { default as Constants } from "expo-constants";

import * as Notifications from "expo-notifications";
import { NotificationResponse } from "expo-notifications";

import { createMutex } from "locks";

import i18n from "~/i18n";

import {
  SubscribeToNotificationsDocument,
  SubscribeToNotificationsMutation,
  UnsubscribeFromNotificationsDocument,
  UnsubscribeFromNotificationsMutation,
} from "~/graph";

import {
  saveToAsyncStorage,
  removeFromAsyncStorage,
  loadFromAsyncStorage,
} from "~/utils/storage";

import { GEOFENCE_NOTIFICATIONS, isGeofenceNotification } from "./geofencing";
import { ALERT_NOTIFICATIONS, isAlertNotification } from "./alerts";

const scope = "Common.Notifications";

const registrationMutex = createMutex();

export type NOTIFICATIONS = GEOFENCE_NOTIFICATIONS | ALERT_NOTIFICATIONS;

export function isNotification(data: unknown): data is NOTIFICATIONS {
  return isAlertNotification(data) || isGeofenceNotification(data);
}

export const getDevicePushToken = async (): Promise<Notifications.DevicePushToken> => {
  const token = await Notifications.getDevicePushTokenAsync();
  return token;
};

export const getNotificationPermissionsAsyncWithoutPrompting = async (): Promise<boolean> => {
  const settings = await Notifications.getPermissionsAsync();

  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

export const ensureOrRequestNotificationsPermissions = async (): Promise<boolean> => {
  const response = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
    android: {},
  });

  if (Platform.OS === "android" && !response.granted) {
    Alert.alert(
      i18n.t("alertTitle", { scope }),
      i18n.t("alertDescription", { scope }),
      [
        {
          text: i18n.t("openSettings", { scope }),
          onPress: () => Linking.openSettings(),
        },
      ],
      { cancelable: false }
    );
    return false;
  }

  if (
    Platform.OS === "ios" &&
    (response?.ios?.status === Notifications.IosAuthorizationStatus.DENIED ||
      response?.ios?.status ===
        Notifications.IosAuthorizationStatus.NOT_DETERMINED)
  ) {
    Alert.alert(
      i18n.t("alertTitle", { scope }),
      i18n.t("alertDescription", { scope }),
      [
        {
          text: i18n.t("openSettings", { scope }),
          onPress: () => Linking.openSettings(),
        },
      ],
      { cancelable: false }
    );
    return false;
  }
  return true;
};

export const extractNotificationData = (
  response: NotificationResponse
): NOTIFICATIONS | undefined => {
  let { data } = response.notification.request.content;

  if (!data) {
    const { trigger } = response.notification.request;

    if (trigger.type === "push") {
      if ("remoteMessage" in trigger) {
        data = trigger.remoteMessage.data;
      }
    }
  }

  return isNotification(data) ? data : undefined;
};

export const registerDevice = async (
  client: ApolloClient<unknown>,
  pushToken?: Notifications.DevicePushToken
): Promise<void> => {
  // The listener that is registered in the usePushTokenListner hook
  // fires when getDevicePushToken() is called. Without this mutex, it
  // leads to this method being invoked twice back-to-back. This
  // doesn't break anything spectacularly, but I don't have enough
  // confidence in the idempotency semantics of the
  // subscribeToNotifications mutation to ignore this weird behavior
  // entirely.

  if (!Constants.isDevice) return;
  if (!(await getNotificationPermissionsAsyncWithoutPrompting())) return;

  const token = (pushToken || (await getDevicePushToken())).data as string;

  return new Promise((resolve, reject) => {
    if (registrationMutex.tryLock()) {
      // eslint-disable-next-line promise/catch-or-return
      client
        .mutate<SubscribeToNotificationsMutation>({
          mutation: SubscribeToNotificationsDocument,
          variables: {
            input: {
              token: token,
              platform: Platform.select({
                ios: "IOS",
                android: "ANDROID",
              }),
            },
          },
        })
        .then(({ data }) => {
          if (
            data &&
            data.subscribeToNotifications.__typename ===
              "SubscribeToNotificationsSuccess"
          ) {
            return saveToAsyncStorage(
              "device_push_token",
              data.subscribeToNotifications.pushToken.id
            );
          }
          return;
        })
        .then(() => resolve())
        .catch(() => reject())
        .finally(() => registrationMutex.unlock());
    } else {
      resolve();
    }
  });
};

export const unregisterDevice = async (
  client: ApolloClient<unknown>
): Promise<void> => {
  const id = await loadFromAsyncStorage("device_push_token");

  if (!id) return;

  const { data } = await client.mutate<UnsubscribeFromNotificationsMutation>({
    mutation: UnsubscribeFromNotificationsDocument,
    variables: {
      input: {
        id,
      },
    },
  });

  if (
    data?.unsubscribeFromNotifications.__typename ===
    "UnsubscribeFromNotificationsSuccess"
  ) {
    await removeFromAsyncStorage("device_push_token");
  }
};

export const usePushTokenListener = (): void => {
  const client = useApolloClient();

  useEffect(() => {
    const subscription = Notifications.addPushTokenListener((token) => {
      void registerDevice(client, token);
    });
    return () => subscription.remove();
  }, [client]);
};
