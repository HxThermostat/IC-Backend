import { useCallback, useEffect, useState } from "react";

import { useApolloClient } from "@apollo/client";

import {
  ensureOrRequestNotificationsPermissions,
  getNotificationPermissionsAsyncWithoutPrompting,
  registerDevice,
} from "~/utils/notifications";

import { useAppState } from "~/contexts";

export const usePushNotificationsEnabled = (): boolean | undefined => {
  // We want to trigger a refresh when the app changes state to handle
  // the user (re-)enabling notifications via Settings
  const appState = useAppState();

  const [enabled, setEnabled] = useState<boolean>();

  useEffect(() => {
    getNotificationPermissionsAsyncWithoutPrompting()
      .then((enabled) => setEnabled(enabled))
      .catch(() => undefined);
  }, [appState]);

  return enabled;
};

export const usePushNotifications = (
  enabledOnServer: boolean
): [boolean, (enabled: boolean) => Promise<void>] => {
  const client = useApolloClient();

  const [notificationEnabled, setNotificationEnabledInternal] = useState(
    enabledOnServer ?? false
  );

  useEffect(() => {
    void (async () => {
      const hasPermision = await getNotificationPermissionsAsyncWithoutPrompting();
      if (!hasPermision) {
        setNotificationEnabledInternal(false);
      }
    })();
  }, []);

  const setNotificationEnabled = useCallback(
    async (enabled: boolean): Promise<void> => {
      if (!enabled) {
        setNotificationEnabledInternal(false);
        return;
      }

      const notificationsEnabled = await ensureOrRequestNotificationsPermissions();
      setNotificationEnabledInternal(notificationsEnabled);

      if (!notificationsEnabled) return;

      // The device may already be registered, but it doesn't hurt to
      // ensure that here
      void registerDevice(client);
    },
    [client]
  );
  return [notificationEnabled, setNotificationEnabled];
};
