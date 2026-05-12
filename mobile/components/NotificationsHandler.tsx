import { useLastNotificationResponse } from "expo-notifications";
import React, { useEffect, useState } from "react";
import { View, Linking } from "react-native";

import { useController, useFeatureFlags } from "~/contexts";

import { useToggleLocationAwayMutation } from "~/graph";

import { extractNotificationData } from "~/utils/notifications";

import { URI_SCHEME } from "~/config/constants";

const NotificationsHandler = (): JSX.Element => {
  const { setControllerId, setLocationId, locationCount } = useController();
  const { isVariantEnabled } = useFeatureFlags();

  const [changeAway] = useToggleLocationAwayMutation();

  const lastNotificationResponse = useLastNotificationResponse();
  const [lastIdHandled, setLastIdHandled] = useState<string | null>(null);

  useEffect(() => {
    if (!lastNotificationResponse) {
      return;
    }
    const notificationId =
      lastNotificationResponse?.notification?.request?.identifier;

    if (lastIdHandled === notificationId) {
      return;
    }

    setLastIdHandled(notificationId);

    const data = extractNotificationData(lastNotificationResponse);
    if (!data) return;

    switch (data.type) {
      case "GEOFENCE_LEAVE": {
        if (isVariantEnabled("away", ["AWAY_LOCATION"])) {
          void changeAway({
            variables: { input: { id: data.locationId, active: true } },
          });
          void setLocationId(data.locationId);
          void Linking.openURL(`${URI_SCHEME}://home`);
        }
        break;
      }
      case "CONTROLLER_TEMPERATURE_NOTIFICATION":
      case "CONTROLLER_HUMIDITY_NOTIFICATION": {
        void setControllerId(data.controllerId);
        void Linking.openURL(`${URI_SCHEME}://home`);
        break;
      }
      case "LOCATION_FAULT_NOTIFICATION": {
        void setLocationId(data.locationId);
        void Linking.openURL(
          `${URI_SCHEME}://settings/faultLogs/${locationCount}/${data.locationId}`
        );
        break;
      }
      case "LOCATION_TEMPERATURE_NOTIFICATION":
      case "LOCATION_HUMIDITY_NOTIFICATION": {
        void setLocationId(data.locationId);
        void Linking.openURL(`${URI_SCHEME}://home`);
        break;
      }
      default: {
        break;
      }
    }
  }, [
    lastNotificationResponse,
    changeAway,
    isVariantEnabled,
    setControllerId,
    setLocationId,
    lastIdHandled,
    locationCount,
  ]);

  return <View />;
};

export default NotificationsHandler;
