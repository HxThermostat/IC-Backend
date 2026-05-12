import React, { useCallback, useMemo } from "react";

import { Platform, SectionList } from "react-native";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import { withBackground } from "~/components/Background";

import { Row } from "~/components/Box";

import { AddTemperaturePresetIcon } from "~/components/Icons";

import {
  Divider,
  Section,
  SectionHeader,
  SectionListDefaults,
  Sections,
} from "~/components/Lists";

import { ConnectedTemperaturePresetRow } from "~/components/TemperaturePresets";

import Text from "~/components/Text";

import { Touchable } from "~/components/Touchables";

import { QueryIdProvider } from "~/contexts";

import i18n from "~/i18n";

import {
  GoBack,
  TemperaturePreset,
  useListTemperaturePresetsQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import { makeToDisplay } from "~/utils/display";

const ICON_SIZE = { width: 40, height: 40 };

const scope = "Screens.Authenticated.SettingsNavigator.ListTemperaturePresets";

function ListFooter({ onPress }: { onPress: () => void }): JSX.Element {
  return (
    <>
      {Platform.OS === "ios" && <Divider />}
      <Touchable
        onPress={onPress}
        backgroundColor={
          Platform.OS === "ios" ? "listItemBackground" : undefined
        }
        paddingVertical="m"
        paddingLeft="l"
      >
        <Row alignItems="center">
          <AddTemperaturePresetIcon
            innerBoxProps={ICON_SIZE}
            size={26}
            color={"text"}
          />
          <Text variant="heading" marginLeft="m">
            {i18n.t("add", { scope })}
          </Text>
        </Row>
      </Touchable>
      {Platform.OS === "ios" && <Divider />}
    </>
  );
}

export type ListTemperaturePresetsProps = {
  navigation: NativeStackNavigationProp<
    SettingsNavigatorRouteList,
    "ListTemperaturePresets"
  >;
  route: RouteProp<SettingsNavigatorRouteList, "ListTemperaturePresets">;
} & WithQueryDataProps<typeof useListTemperaturePresetsQuery>;

function ListTemperaturePresets({
  navigation,
  data: { location },
}: ListTemperaturePresetsProps): JSX.Element {
  if (!location) throw new GoBack();
  const { id: locationId } = location;
  const toDisplay = makeToDisplay(location.temperatureUnit);

  const goToManageTemperaturePreset = useCallback(
    (preset: TemperaturePreset) => {
      navigation.navigate("ManageTemperaturePreset", {
        locationId,
        temperaturePresetId: preset.id,
      });
    },
    [locationId, navigation]
  );

  const goToNewTemperaturePreset = useCallback(() => {
    navigation.navigate("NewTemperaturePreset", {
      locationId,
    });
  }, [locationId, navigation]);

  const sections = useMemo<Sections<TemperaturePreset>>(() => {
    const builtIn: TemperaturePreset[] = [];
    const custom: TemperaturePreset[] = [];

    location.temperaturePresets?.forEach((preset) => {
      const target = preset.removable ? custom : builtIn;
      target.push(preset);
    });

    return [
      {
        title: i18n.t("sectionTitleBuiltIn", { scope }),
        data: builtIn,
      },
      {
        title: i18n.t("sectionTitleCustom", { scope }),
        data: custom,
      },
    ].filter((section) => section.data.length > 0);
  }, [location.temperaturePresets]);

  return (
    <SectionListDefaults<TemperaturePreset, Section<TemperaturePreset>>
      sections={sections}
    >
      {(defaults) => (
        <SectionList
          {...defaults}
          contentContainerStyle={[defaults.contentContainerStyle]}
          renderItem={({ item }) => (
            <QueryIdProvider queryId={item.id}>
              <ConnectedTemperaturePresetRow
                toDisplay={toDisplay}
                onPress={() => goToManageTemperaturePreset(item)}
              />
            </QueryIdProvider>
          )}
          renderSectionHeader={({ section }) => {
            return <SectionHeader title={section.title} />;
          }}
          ListFooterComponent={
            <ListFooter onPress={goToNewTemperaturePreset} />
          }
        />
      )}
    </SectionListDefaults>
  );
}

export default withBackground(
  withQueryData(useListTemperaturePresetsQuery, {
    options: { fetchPolicy: "cache-and-network" },
    useVariables() {
      const route = useRoute<
        RouteProp<SettingsNavigatorRouteList, "ListTemperaturePresets">
      >();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(ListTemperaturePresets)
);
