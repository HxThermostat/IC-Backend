import React, { useLayoutEffect, useMemo } from "react";
import { StyleSheet } from "react-native";

import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";
import { SettingsNames, SettingsParams } from "~/navigators/types";

import {
  useSettingsLocationQuery,
  WithQueryDataProps,
  GoBack,
  withQueryData,
  Screen_Settings_LocationFragment as LocationType,
} from "~/graph";

import i18n from "~/i18n";

import {
  useActionSheet,
  usePushNotificationsEnabled,
  useSetTemperatureUnit,
} from "~/hooks";

import { useAuth, useController, useFeatureFlags } from "~/contexts";

import { withBackground } from "~/components/Background";
import FlatList, { ListData } from "~/components/Lists/FlatList";
import { BaseListItem } from "~/components/Lists";

import {
  setpointRange,
  temperatureRange,
  humidityRange,
  makeToDisplay,
} from "~/utils/display";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

const styles = StyleSheet.create({
  container: {},
});

const scope = "Screens.Authenticated.SettingsNavigator.Location";

export const useLocationItem = (location: LocationType): ListData => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { removeLocation } = useAuth();
  const { locationId: selectedLocationId, reset } = useController();
  const {
    handleEnabledFeature,
    handleEnabledVariant,
    handleEnabledVariants,
  } = useFeatureFlags();
  const { setTemperatureUnit } = useSetTemperatureUnit();
  const notificationsEnabled = usePushNotificationsEnabled();
  const { trackFeatureUse, trackFunnel } = useKohortTracking();
  const toDisplay = makeToDisplay(location.temperatureUnit);
  const singleControllerId =
    location.controllers.length === 1 ? location.controllers[0].id : undefined;

  const awayLabel =
    (location.away && setpointRange(location.away.setpoint, toDisplay)) ??
    undefined;

  const hasTemperatureLocationNotification = !!location?.temperatureNotification;
  const temperatureLocationNotification = location?.temperatureNotification;
  const locationTemperatureNotificationSubtitle =
    hasTemperatureLocationNotification &&
    notificationsEnabled !== false &&
    temperatureLocationNotification?.enabled
      ? temperatureRange(temperatureLocationNotification, toDisplay)
      : undefined;

  const temperatureNotificationItem = useMemo(() => {
    return handleEnabledVariants(
      "notifications",
      [["LOCATION_TEMPERATURE"]],
      (): BaseListItem => {
        return {
          title: i18n.t("temperatureNotifications", { scope }),
          subtitle: locationTemperatureNotificationSubtitle,
          displayChevronIOS: hasTemperatureLocationNotification,
          disabled: !hasTemperatureLocationNotification,
          navigate: {
            name: "LocationTemperatureNotification",
            params: { locationId: location.id },
          },
        };
      }
    );
  }, [
    handleEnabledVariants,
    location.id,
    hasTemperatureLocationNotification,
    locationTemperatureNotificationSubtitle,
  ]);

  const hasHumidityLocationNotification = !!location?.humidityNotification;
  const humidityLocationNotification = location?.humidityNotification;
  const locationHumidityNotificationSubtitle =
    hasHumidityLocationNotification &&
    notificationsEnabled !== false &&
    humidityLocationNotification?.enabled
      ? humidityRange(humidityLocationNotification)
      : undefined;

  const humidityNotificationItem = useMemo(() => {
    return handleEnabledVariants(
      "notifications",
      [["LOCATION_HUMIDITY"]],
      (): BaseListItem => {
        return {
          title: i18n.t("humidityNotifications", { scope }),
          subtitle: locationHumidityNotificationSubtitle,
          displayChevronIOS: hasHumidityLocationNotification,
          disabled: !hasHumidityLocationNotification,
          navigate: {
            name: "LocationHumidityNotification",
            params: { locationId: location.id },
          },
        };
      }
    );
  }, [
    handleEnabledVariants,
    location.id,
    locationHumidityNotificationSubtitle,
    hasHumidityLocationNotification,
  ]);

  const holdLengthLabel = location.defaultHoldLength
    ? location.defaultHoldLength.__typename === "HoldLengthHours"
      ? i18n.t(`${location.defaultHoldLength.__typename}.counting`, {
          scope,
          count: location.defaultHoldLength.hours,
        })
      : i18n.t(String(location.defaultHoldLength.__typename), { scope })
    : undefined;

  const nameItem = useMemo(
    () =>
      handleEnabledFeature(
        "rename",
        (variants): BaseListItem => {
          const item: BaseListItem = {
            title: i18n.t("rename", { scope }),
            displayChevronIOS: true,
          };

          if (
            variants.includes("CONTROLLER") &&
            variants.includes("LOCATION")
          ) {
            item.navigate = {
              name: "Names",
              params: { locationId: location.id },
            };
          } else if (variants.includes("CONTROLLER")) {
            if (singleControllerId) {
              item.navigate = {
                name: "RenameRoom",
                params: { controllerId: singleControllerId },
              };
            } else {
              item.navigate = {
                name: "RoomNames",
                params: { locationId: location.id },
              };
            }
          } else {
            item.navigate = {
              name: "RenameLocation",
              params: { locationId: location.id },
            };
          }

          return item;
        }
      ),
    [handleEnabledFeature, location.id, singleControllerId]
  );

  const savedTemperaturesItem = useMemo<BaseListItem | null>(() => {
    return handleEnabledVariants(
      "schedule",
      ["SCHEDULE_TEMPERATURE", "SCHEDULE_TEMPERATURE_FAN"],
      (): BaseListItem => ({
        title: i18n.t("temperaturePresets", { scope }),
        displayChevronIOS: true,
        navigate: {
          name: "ListTemperaturePresets",
          params: {
            locationId: location.id,
          },
        },
      })
    );
  }, [handleEnabledVariants, location.id]);

  const historyItem = useMemo(
    () =>
      handleEnabledVariants(
        "faultLogsLocation",
        ["LOG_WITH_LABEL", "LOG_WITH_LABEL_AND_DESCRIPTION"],
        (): BaseListItem => ({
          title: i18n.t("history", { scope }),
          displayChevronIOS: true,
          displayBadge: !!location.faultActive,
          navigate: {
            name: "FaultLogsLocation",
            params: { locationId: location.id },
          },
        })
      ),
    [handleEnabledVariants, location.faultActive, location.id]
  );

  const temperatureUnitItem = useMemo(
    () =>
      handleEnabledVariant(
        "changeTemperatureUnit",
        "APP_ONLY",
        (): BaseListItem => ({
          title: i18n.t("temperatureUnit", { scope }),
          subtitle: location.temperatureUnit === "F" ? "℉" : "℃",
          onPress: () => {
            showActionSheetWithOptions({
              items: [
                {
                  label: i18n.t("temperatureUnitSheet.F", { scope }),
                  onPress: () => {
                    trackFeatureUse("Change Temp Unit", "F");
                    trackFunnel({ step: KohortFunnelEventStep.Action });
                    setTemperatureUnit(location.id, "F");
                  },
                },
                {
                  label: i18n.t("temperatureUnitSheet.C", { scope }),
                  onPress: () => {
                    trackFeatureUse("Change Temp Unit", "C");
                    trackFunnel({ step: KohortFunnelEventStep.Action });
                    setTemperatureUnit(location.id, "C");
                  },
                },
                {
                  label: i18n.t("Common.cancel"),
                  cancel: true,
                },
              ],
              title: i18n.t("temperatureUnitSheet.title", { scope }),
            });
          },
        })
      ),
    [
      handleEnabledVariant,
      location.temperatureUnit,
      location.id,
      setTemperatureUnit,
      showActionSheetWithOptions,
      trackFeatureUse,
      trackFunnel,
    ]
  );

  const awayItem = useMemo(
    () =>
      handleEnabledVariants(
        "away",
        [["AWAY_CONTROLLER"], ["AWAY_LOCATION"]],
        (): BaseListItem => ({
          title: i18n.t("away", { scope }),
          displayChevronIOS: true,
          subtitle: awayLabel,
          navigate: {
            name: "Away",
            params: {
              locationId: location.id,
            },
          },
        })
      ),
    [awayLabel, handleEnabledVariants, location.id]
  );

  const holdLengthItem = useMemo(
    () =>
      handleEnabledFeature(
        "changeDefaultHoldLengthLocation",
        (): BaseListItem => ({
          title: i18n.t("holdLength", { scope }),
          subtitle: holdLengthLabel,
          displayChevronIOS: true,
          navigate: {
            name: "HoldLength",
            params: {
              locationId: location.id,
            },
          },
        })
      ),
    [handleEnabledFeature, holdLengthLabel, location.id]
  );

  return useMemo<ListData>(
    () => [
      ...(nameItem ? [nameItem] : []),
      ...(historyItem ? [historyItem] : []),
      ...(temperatureUnitItem ? [temperatureUnitItem] : []),
      ...(awayItem ? [awayItem] : []),
      ...(holdLengthItem ? [holdLengthItem] : []),
      ...(temperatureNotificationItem ? [temperatureNotificationItem] : []),
      ...(humidityNotificationItem ? [humidityNotificationItem] : []),
      ...(savedTemperaturesItem ? [savedTemperaturesItem] : []),

      {
        title: i18n.t("deleteThermostat", { scope }),
        actsAsButton: true,
        onPress() {
          showActionSheetWithOptions({
            items: [
              {
                label: i18n.t("Common.cancel"),
                cancel: true,
              },
              {
                label: i18n.t("deleteThermostatSheet.confirm", { scope }),
                destructive: true,
                onPress: async () => {
                  await removeLocation(location.id);
                  if (selectedLocationId === location.id) {
                    await reset();
                  }
                },
              },
            ],
            title: i18n.t("deleteThermostatSheet.title", { scope }),
            message: i18n.t("deleteThermostatSheet.message", { scope }),
          });
        },
      },
    ],
    [
      awayItem,
      historyItem,
      holdLengthItem,
      location.id,
      nameItem,
      removeLocation,
      reset,
      selectedLocationId,
      showActionSheetWithOptions,
      temperatureUnitItem,
      temperatureNotificationItem,
      humidityNotificationItem,
      savedTemperaturesItem,
    ]
  );
};

type LocationNavigationProp = NativeStackNavigationProp<
  SettingsNavigatorRouteList,
  "Location"
>;

export type LocationProps = {
  navigation: LocationNavigationProp;
  route: RouteProp<SettingsNavigatorRouteList, "Location">;
} & WithQueryDataProps<typeof useSettingsLocationQuery>;

function Location({
  navigation,
  data: { location },
}: LocationProps): JSX.Element {
  if (!location) throw new GoBack();

  const items = useLocationItem(location);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: location.name,
    });
  }, [navigation, location.name]);

  function handleItemPress(item: BaseListItem): void {
    if (item.navigate) {
      navigation.navigate(
        item.navigate.name as SettingsNames,
        item.navigate.params as SettingsParams
      );
    }
    if (item.onPress) {
      item.onPress();
    }
  }
  return (
    <FlatList
      alwaysBounceVertical={false}
      contentContainerStyle={styles.container}
      data={items}
      handleItemPress={handleItemPress}
    />
  );
}

export default withBackground(
  withQueryData(useSettingsLocationQuery, {
    useVariables: () => {
      const route = useRoute<LocationProps["route"]>();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(Location)
);
