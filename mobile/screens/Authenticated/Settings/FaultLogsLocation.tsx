import React, { useCallback, useMemo } from "react";

import moment from "moment";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";
import { SettingsNames, SettingsParams } from "~/navigators/types";

import {
  useSettingsFaultLogsLocationQuery,
  useScreenSettingsFaultLogsLocationQuery,
  withQueryData,
  WithQueryDataProps,
  GoBack,
} from "~/graph";

import { withBackground } from "~/components/Background";
import { ListData } from "~/components/Lists/FlatList";
import { BaseListItem, SectionList, Sections } from "~/components/Lists";
import Text from "~/components/Text";
import ActivityIndicator from "~/components/ActivityIndicator";

import { useFeatureFlags } from "~/contexts";

import i18n from "~/i18n";

import { useHeaderButton, usePushNotificationsEnabled } from "~/hooks";

export type FaultLogsProps = {
  navigation: NativeStackNavigationProp<
    SettingsNavigatorRouteList,
    "FaultLogsLocation"
  >;
  route: RouteProp<SettingsNavigatorRouteList, "FaultLogsLocation">;
} & WithQueryDataProps<typeof useScreenSettingsFaultLogsLocationQuery>;

const scope = "Screens.Authenticated.SettingsNavigator.FaultLogsLocation";

function FaultLogsLocation({
  route,
  navigation,
  data: { location },
}: FaultLogsProps): JSX.Element {
  if (!location) throw new GoBack();
  const { handleEnabledVariant } = useFeatureFlags();

  const notificationsEnabled = usePushNotificationsEnabled();

  const faultNotification = !!location?.faultNotification;
  const faultNotificationSubtitle =
    location?.faultNotification?.enabled && notificationsEnabled !== false
      ? i18n.t("notificationEnabled", { scope })
      : undefined;

  const faultNotificationItem = useMemo(() => {
    return handleEnabledVariant(
      "notifications",
      ["LOCATION_FAULTS"],
      (): BaseListItem => {
        return {
          title: i18n.t("faultNotifications", { scope }),
          subtitle: faultNotificationSubtitle,
          displayChevronIOS: faultNotification,
          disabled: !faultNotification,
          navigate: {
            name: "LocationFaultsNotification",
            params: { locationId: location.id },
          },
        };
      }
    );
  }, [
    handleEnabledVariant,
    location.id,
    faultNotificationSubtitle,
    faultNotification,
  ]);

  const {
    data: dataLogs,
    loading: loadingLogs,
    refetch: refetchLogs,
  } = useSettingsFaultLogsLocationQuery({
    variables: { locationId: route.params.locationId },
    fetchPolicy: "cache-and-network",
  });
  const onRefetchPress = useCallback(
    () => refetchLogs({ locationId: route.params.locationId }),
    [refetchLogs, route.params.locationId]
  );

  useHeaderButton({
    loading: loadingLogs,
    disabled: loadingLogs,
    onPress: onRefetchPress,
    placement: "headerRight",
    text: i18n.t("refetch", { scope }),
  });

  const faultLogs: ListData = useMemo(
    () =>
      (dataLogs?.location?.faultLogs ?? []).map((log, index) => {
        const hasDescription = log.__typename === "FaultLogLabelAndDescription";
        return {
          title: log.label,
          subtitle: moment(log.date).format("l LT"),
          displayChevronIOS: hasDescription,
          navigate: hasDescription
            ? {
                name: "FaultLogDescription",
                params: {
                  index,
                  locationId: location.id,
                },
              }
            : undefined,
        };
      }),
    [dataLogs?.location?.faultLogs, location.id]
  );

  const sections = useMemo<Sections>((): Sections => {
    const sections: Sections = [];
    if (faultNotificationItem) {
      sections.push({
        data: [faultNotificationItem],
      });
    }
    if (faultLogs.length > 0) {
      sections.push({
        data: faultLogs,
      });
    }

    return sections;
  }, [faultLogs, faultNotificationItem]);

  const handleItemPress = useCallback(
    (item: BaseListItem): void => {
      if (item.navigate) {
        navigation.navigate(
          item.navigate.name as SettingsNames,
          item.navigate.params as SettingsParams
        );
      }
      if (item.onPress) {
        item.onPress();
      }
    },
    [navigation]
  );

  return (
    <SectionList
      handleItemPress={handleItemPress}
      alwaysBounceVertical={false}
      sections={sections}
      ListFooterComponent={
        !dataLogs ? (
          <ActivityIndicator />
        ) : faultLogs.length === 0 ? (
          <Text variant="sublistLabel" textAlign="center">
            {i18n.t("noFaults", { scope })}
          </Text>
        ) : undefined
      }
    />
  );
}

export default withBackground(
  withQueryData(useScreenSettingsFaultLogsLocationQuery, {
    useVariables: () => {
      const route = useRoute<FaultLogsProps["route"]>();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(FaultLogsLocation)
);
