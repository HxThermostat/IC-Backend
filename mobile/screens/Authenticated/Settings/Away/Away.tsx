import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";
import { SettingsNames, SettingsParams } from "~/navigators/types";

import { withBackground } from "~/components/Background";
import {
  BaseListItem,
  ListData,
  Section,
  SectionList,
  Sections,
} from "~/components/Lists";

import ActivityIndicator from "~/components/ActivityIndicator";

import { UnsupportedVariant, useFeatureFlags } from "~/contexts";

import {
  WithQueryDataProps,
  withQueryData,
  useAwayLocationQuery,
  GoBack,
} from "~/graph";

import i18n from "~/i18n";

import { currentGeofence } from "~/utils/background-tasks";

import { makeToDisplay, setpointRange } from "~/utils/display";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const scope = "Screens.Authenticated.SettingsNavigator.Away";

export type AwayProps = {
  navigation: NativeStackNavigationProp<SettingsNavigatorRouteList, "Away">;
} & WithQueryDataProps<typeof useAwayLocationQuery>;

function Away({ data: { location }, navigation }: AwayProps): JSX.Element {
  if (!location) throw new GoBack();

  const { handleFeature } = useFeatureFlags();

  const [geofenceEnabled, setGeofenceEnabled] = useState<boolean>();

  const toDisplay = makeToDisplay(location.temperatureUnit);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        setGeofenceEnabled(!!(await currentGeofence(location.id)));
      })();

      return () => setGeofenceEnabled(undefined);
    }, [location.id])
  );

  const generalSection = useMemo<Section>(
    () => ({
      data: [
        {
          title: i18n.t("geofencing", { scope }),
          subtitle:
            geofenceEnabled === true
              ? i18n.t("geofencingEnabled", { scope })
              : undefined,
          rightElement:
            geofenceEnabled == null ? (
              <ActivityIndicator size={"small"} />
            ) : undefined,
          displayChevronIOS: true,

          navigate: {
            name: "Geofence",
            params: {
              locationId: location.id,
            },
          },
        },
      ],
    }),
    [geofenceEnabled, location.id]
  );

  const locationSections = useMemo<ListData>(
    () => [
      {
        title: i18n.t("setpoints", { scope }),
        subtitle:
          location.away?.setpoint &&
          setpointRange(location.away?.setpoint, toDisplay),
        disabled: location.away == null,
        navigate: { name: "AwayLocation", params: { locationId: location.id } },
      },
    ],
    [location.away, location.id, toDisplay]
  );

  const controllerSections = useMemo<ListData>(
    () =>
      location.controllers.map<BaseListItem>(({ id, name, away }) => ({
        title: name,
        subtitle: away ? setpointRange(away.setpoint, toDisplay) : undefined,
        disabled: !away,
        navigate: {
          name: "AwayController",
          params: {
            controllerId: id,
          },
        },
      })),
    [location.controllers, toDisplay]
  );

  const sections = useMemo<Sections>(
    () =>
      handleFeature(
        "away",
        (variant, feature): Sections => {
          const sections: Sections = [];

          if (variant?.includes("AWAY_LOCATION")) {
            sections.push(generalSection);
          }

          if (variant?.includes("AWAY_CONTROLLER")) {
            sections.push({
              title: i18n.t("setpoints", { scope }),
              data: controllerSections,
            });
          } else if (variant?.includes("AWAY_LOCATION")) {
            sections.push({
              data: locationSections,
            });
          }

          if (sections.length) return sections;

          throw new UnsupportedVariant(feature, variant);
        }
      ),
    [controllerSections, generalSection, handleFeature, locationSections]
  );

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
      contentContainerStyle={styles.container}
      handleItemPress={handleItemPress}
      sections={sections}
    />
  );
}

export default withBackground(
  withQueryData(useAwayLocationQuery, {
    useVariables() {
      const route = useRoute<RouteProp<SettingsNavigatorRouteList, "Away">>();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(Away)
);
