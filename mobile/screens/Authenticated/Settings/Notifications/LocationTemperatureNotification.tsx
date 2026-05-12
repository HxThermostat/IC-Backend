import React, { useState, useLayoutEffect, useCallback, useMemo } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import {
  useLocationNotificationsQuery,
  useAdjustLocationTemperatureNotificationThresholdMutation,
  WithQueryDataProps,
  GoBack,
  withQueryData,
  useToggleLocationTemperatureNotificationMutation,
} from "~/graph";

import Screen from "~/components/Screen";
import AdjustTemperatureBlock from "~/components/AdjustTemperatureBlock";
import ToggleBlock from "~/components/ToggleBlock";
import Text from "~/components/Text";

import { useSaveButton, useDualRangeSafe } from "~/hooks";
import { usePushNotifications } from "~/hooks/usePushNotifications";

import i18n from "~/i18n";

import { equal } from "~/utils/math";
import { makeToDisplay } from "~/utils/display";

type LocationTemperatureNotificationNavigationProp = NativeStackNavigationProp<
  SettingsNavigatorRouteList,
  "LocationTemperatureNotification"
>;

export type LocationTemperatureNotificationProps = {
  navigation: LocationTemperatureNotificationNavigationProp;
  route: RouteProp<
    SettingsNavigatorRouteList,
    "LocationTemperatureNotification"
  >;
} & WithQueryDataProps<typeof useLocationNotificationsQuery>;

const scope =
  "Screens.Authenticated.SettingsNavigator.LocationTemperatureNotification";

function TemperatureNotification(
  props: LocationTemperatureNotificationProps
): JSX.Element {
  const {
    navigation,
    data: { location },
  } = props;
  if (!location || !location.temperatureNotification) throw new GoBack();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: location.name,
    });
  }, [navigation, location.name]);

  const toDisplay = makeToDisplay(location.temperatureUnit);

  const [notificationEnabled, setNotificationEnabled] = usePushNotifications(
    location.temperatureNotification.enabled
  );

  const [temperatureSetpoint, setTemperatureSetpointTo] = useState({
    lower: location.temperatureNotification.lower.value,
    upper: location.temperatureNotification.upper.value,
  });

  const [toggleEnabled] = useToggleLocationTemperatureNotificationMutation({
    variables: {
      input: {
        id: location.id,
        enabled: notificationEnabled,
      },
    },
  });

  const [
    adjustThreshold,
  ] = useAdjustLocationTemperatureNotificationThresholdMutation({
    variables: {
      input: {
        id: location.id,
        lower: temperatureSetpoint.lower,
        upper: temperatureSetpoint.upper,
      },
    },
  });

  const handleSave = useCallback(async () => {
    const minWait = new Promise((resolve) => setTimeout(resolve, 500));
    if (notificationEnabled !== location.temperatureNotification?.enabled) {
      await toggleEnabled();
    }

    if (
      !equal(
        temperatureSetpoint.lower,
        location.temperatureNotification?.lower.value ?? NaN
      ) ||
      !equal(
        temperatureSetpoint.upper,
        location.temperatureNotification?.upper.value ?? NaN
      )
    ) {
      await adjustThreshold();
    }

    await minWait;
  }, [
    adjustThreshold,
    location.temperatureNotification?.enabled,
    location.temperatureNotification?.lower.value,
    location.temperatureNotification?.upper.value,
    notificationEnabled,
    temperatureSetpoint.lower,
    temperatureSetpoint.upper,
    toggleEnabled,
  ]);

  const { didChange } = useSaveButton({
    handleSave,
  });

  const onTemperatureSetpointValuesChange = useCallback(
    (lower: number, upper: number) => {
      setTemperatureSetpointTo({ upper, lower });
      didChange();
    },
    [didChange]
  );

  const {
    increaseDualRangeSafe: increaseSetpointSafe,
    decreaseDualRangeSafe: decreaseSetpointSafe,
  } = useDualRangeSafe(
    temperatureSetpoint.lower,
    temperatureSetpoint.upper,
    location.temperatureNotification.lower,
    location.temperatureNotification.upper,
    location.temperatureNotification.minInterval,
    onTemperatureSetpointValuesChange
  );

  const onToggleValueChange = useCallback(
    async (enabled: boolean) => {
      await setNotificationEnabled(enabled);
      didChange();
    },
    [didChange, setNotificationEnabled]
  );

  return (
    <Screen>
      <ToggleBlock
        title={i18n.t("title", { scope })}
        value={notificationEnabled}
        onValueChange={onToggleValueChange}
        body={i18n.t("body", { scope })}
      />

      <Text variant="heading">{i18n.t("lowerThan", { scope })}</Text>
      <AdjustTemperatureBlock
        currentTemperature={toDisplay(temperatureSetpoint.lower)}
        onIncreasePress={() => increaseSetpointSafe("lower")}
        onDecreasePress={() => decreaseSetpointSafe("lower")}
      />

      <Text variant="heading">{i18n.t("higherThan", { scope })}</Text>
      <AdjustTemperatureBlock
        currentTemperature={toDisplay(temperatureSetpoint.upper)}
        onIncreasePress={() => increaseSetpointSafe("upper")}
        onDecreasePress={() => decreaseSetpointSafe("upper")}
      />
    </Screen>
  );
}

export default withQueryData(useLocationNotificationsQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: () => {
    const route = useRoute<LocationTemperatureNotificationProps["route"]>();
    return useMemo(() => ({ locationId: route.params.locationId }), [
      route.params.locationId,
    ]);
  },
})(TemperatureNotification);
