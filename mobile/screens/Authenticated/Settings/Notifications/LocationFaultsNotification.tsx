import React, { useMemo } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import ToggleBlock from "~/components/ToggleBlock";

import i18n from "~/i18n";

import {
  useLocationNotificationsQuery,
  useToggleLocationFaultNotificationMutation,
  GoBack,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import { useLazyEffect } from "~/hooks";
import { usePushNotifications } from "~/hooks/usePushNotifications";
import Screen from "~/components/Screen";

type LocationFaultsNotificationNavigationProp = NativeStackNavigationProp<
  SettingsNavigatorRouteList,
  "LocationFaultsNotification"
>;

export type LocationFaultsNotificationProps = {
  navigation: LocationFaultsNotificationNavigationProp;
  route: RouteProp<SettingsNavigatorRouteList, "LocationFaultsNotification">;
} & WithQueryDataProps<typeof useLocationNotificationsQuery>;

const scope =
  "Screens.Authenticated.SettingsNavigator.LocationFaultsNotification";

function LocationFaultsNotification(
  props: LocationFaultsNotificationProps
): JSX.Element {
  const {
    data: { location },
  } = props;
  if (!location || !location.faultNotification) throw new GoBack();

  const [notificationEnabled, setNotificationEnabled] = usePushNotifications(
    location.faultNotification.enabled
  );

  const [
    toggleLocationFaultNotificationMutation,
  ] = useToggleLocationFaultNotificationMutation();

  useLazyEffect(() => {
    void toggleLocationFaultNotificationMutation({
      variables: {
        input: {
          enabled: notificationEnabled,
          id: location.id,
        },
      },
    });
  }, [notificationEnabled, location.id]);

  return (
    <Screen>
      <ToggleBlock
        title={i18n.t("title", { scope })}
        value={notificationEnabled}
        onValueChange={setNotificationEnabled}
        body={i18n.t("body", { scope })}
      />
    </Screen>
  );
}

export default withQueryData(useLocationNotificationsQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: () => {
    const route = useRoute<LocationFaultsNotificationProps["route"]>();
    return useMemo(() => ({ locationId: route.params.locationId }), [
      route.params.locationId,
    ]);
  },
})(LocationFaultsNotification);
