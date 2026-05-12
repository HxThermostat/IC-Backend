import React, { useState, useCallback, useMemo } from "react";

import { View } from "react-native";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import { withBackground } from "~/components/Background";
import { CheckmarkIcon } from "~/components/Icons";
import { BaseListItem, FlatList, ListData } from "~/components/Lists";

import {
  FanMode,
  GoBack,
  useChangeTemperaturePresetFanModeMutation,
  useSelectFanModeQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import { useSaveButton } from "~/hooks";

import i18n from "~/i18n";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

const FAN_MODES: Record<FanMode, string> = {
  AUTO: i18n.t("Common.fanSettings.AUTO.itemLabel"),
  ALWAYS: i18n.t("Common.fanSettings.ALWAYS.itemLabel"),
  FIFTEEN: i18n.t("Common.fanSettings.FIFTEEN.itemLabel"),
  THIRTY: i18n.t("Common.fanSettings.THIRTY.itemLabel"),
  FORTYFIVE: i18n.t("Common.fanSettings.FORTYFIVE.itemLabel"),
};

export type SelectFanModeRouteParams = {
  locationId: string;
  fanMode: FanMode | null;
  temperaturePresetId?: string | null;
};

export type ManageTemperaturePresetProps = {
  navigation: NativeStackNavigationProp<
    SettingsNavigatorRouteList,
    "SelectFanMode"
  >;
  route: RouteProp<SettingsNavigatorRouteList, "SelectFanMode">;
} & WithQueryDataProps<typeof useSelectFanModeQuery>;

function SelectFanMode({
  route,
  navigation,
  data: { location },
}: ManageTemperaturePresetProps): JSX.Element {
  if (!location) throw new GoBack();
  const { id: locationId } = location;
  const { fanMode, temperaturePresetId } = route.params;
  const [selectedFanMode, setSelectedFanMode] = useState<FanMode | null>(
    fanMode
  );
  const { trackFeatureUse, trackFunnel } = useKohortTracking();

  const [
    changeTemperaturePresetFanMode,
    { loading },
  ] = useChangeTemperaturePresetFanModeMutation({
    onCompleted: ({ changeTemperaturePresetFanMode }) => {
      if (
        changeTemperaturePresetFanMode.__typename ===
        "ChangeTemperaturePresetFanModeSuccess"
      ) {
        navigation.goBack();
      }
    },
  });

  const handlePressSave = useCallback(async () => {
    if (!selectedFanMode || !temperaturePresetId) return;
    trackFeatureUse("Change Fan Mode", selectedFanMode);
    trackFunnel({ step: KohortFunnelEventStep.Action });
    await changeTemperaturePresetFanMode({
      variables: {
        input: {
          fanMode: selectedFanMode,
          id: temperaturePresetId,
        },
      },
    });
  }, [
    changeTemperaturePresetFanMode,
    selectedFanMode,
    temperaturePresetId,
    trackFeatureUse,
    trackFunnel,
  ]);

  const { didChange } = useSaveButton({
    // only show save button if preset already exists
    platform: temperaturePresetId ? undefined : [],
    loading,
    disabled: !temperaturePresetId || !fanMode,
    handleSave: handlePressSave,
    placement: "headerRight",
    text: i18n.t("Common.save"),
  });

  function handleFanModeChange(fan: FanMode): void {
    setSelectedFanMode(fan);
    didChange();
    if (!temperaturePresetId) {
      navigation.navigate("ManageTemperaturePreset", {
        locationId,
        temperaturePresetId: temperaturePresetId,
        unsavedFanMode: fan,
      });
    }
  }

  const DATA: ListData = Object.keys(FAN_MODES).map((fan) => ({
    title: FAN_MODES[fan],
    rightElement:
      selectedFanMode === fan ? (
        <CheckmarkIcon color="tint" size={18} />
      ) : (
        <View />
      ),
    onPress: () => handleFanModeChange(fan),
  }));

  function handleItemPress(item: BaseListItem): void {
    if (item.onPress) {
      item.onPress();
    }
  }

  return <FlatList handleItemPress={handleItemPress} data={DATA} />;
}

export default withBackground(
  withQueryData(useSelectFanModeQuery, {
    options: { fetchPolicy: "cache-and-network" },
    useVariables() {
      const route = useRoute<
        RouteProp<SettingsNavigatorRouteList, "SelectFanMode">
      >();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(SelectFanMode)
);
