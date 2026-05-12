import React, { useState, useLayoutEffect, useCallback, useMemo } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import {
  useAdjustLocationHumidityNotificationThresholdMutation,
  GoBack,
  withQueryData,
  useToggleLocationHumidityNotificationMutation,
  WithQueryDataProps,
  useLocationNotificationsQuery,
} from "~/graph";

import Screen from "~/components/Screen";
import AdjustHumidityBlock from "~/components/AdjustHumidityBlock";
import ToggleBlock from "~/components/ToggleBlock";
import Text from "~/components/Text";

import { useSaveButton, useDualRangeSafe, usePushNotifications } from "~/hooks";

import i18n from "~/i18n";
import { equal } from "~/utils/math";

type LocationHumidityNotificationNavigationProp = NativeStackNavigationProp<
  SettingsNavigatorRouteList,
  "LocationHumidityNotification"
>;

export type LocationHumidityNotificationProps = {
  navigation: LocationHumidityNotificationNavigationProp;
  route: RouteProp<SettingsNavigatorRouteList, "LocationHumidityNotification">;
} & WithQueryDataProps<typeof useLocationNotificationsQuery>;

const scope =
  "Screens.Authenticated.SettingsNavigator.LocationHumidityNotification";

function LocationHumidityNotification(
  props: LocationHumidityNotificationProps
): JSX.Element {
  const {
    navigation,
    data: { location },
  } = props;
  if (!location || !location.humidityNotification) throw new GoBack();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: location.name,
    });
  }, [navigation, location.name]);

  const [notificationEnabled, setNotificationEnabled] = usePushNotifications(
    location.humidityNotification.enabled
  );

  const [humiditySetpoint, setHumiditySetpointTo] = useState({
    lower: location.humidityNotification.lower.value,
    upper: location.humidityNotification.upper.value,
  });

  const [toggleEnabled] = useToggleLocationHumidityNotificationMutation({
    variables: {
      input: {
        id: location.id,
        enabled: notificationEnabled,
      },
    },
  });

  const [
    adjustThreshold,
  ] = useAdjustLocationHumidityNotificationThresholdMutation({
    variables: {
      input: {
        id: location.id,
        lower: humiditySetpoint.lower,
        upper: humiditySetpoint.upper,
      },
    },
  });

  const handleSave = useCallback(async () => {
    const minWait = sleep(500);
    if (notificationEnabled !== location.humidityNotification?.enabled) {
      await toggleEnabled();
    }

    if (
      !equal(
        humiditySetpoint.lower,
        location.humidityNotification?.lower.value ?? NaN
      ) ||
      !equal(
        humiditySetpoint.upper,
        location.humidityNotification?.upper.value ?? NaN
      )
    ) {
      await adjustThreshold();
    }

    await minWait;
  }, [
    adjustThreshold,
    humiditySetpoint.lower,
    humiditySetpoint.upper,
    location.humidityNotification?.enabled,
    location.humidityNotification?.lower.value,
    location.humidityNotification?.upper.value,
    notificationEnabled,
    toggleEnabled,
  ]);

  const { didChange } = useSaveButton({
    handleSave,
  });

  const onHumiditySetpointValuesChange = useCallback(
    (lower: number, upper: number) => {
      setHumiditySetpointTo({ upper, lower });
      didChange();
    },
    [didChange]
  );

  const {
    increaseDualRangeSafe: increaseSetpointSafe,
    decreaseDualRangeSafe: decreaseSetpointSafe,
  } = useDualRangeSafe(
    humiditySetpoint.lower,
    humiditySetpoint.upper,
    location.humidityNotification.lower,
    location.humidityNotification.upper,
    location.humidityNotification.minInterval,
    onHumiditySetpointValuesChange
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
      <AdjustHumidityBlock
        handleDecreasePress={() => decreaseSetpointSafe("lower")}
        handleIncreasePress={() => increaseSetpointSafe("lower")}
        value={humiditySetpoint.lower}
        marginHorizontal="l"
      />

      <Text variant="heading">{i18n.t("higherThan", { scope })}</Text>
      <AdjustHumidityBlock
        value={humiditySetpoint.upper}
        handleDecreasePress={() => decreaseSetpointSafe("upper")}
        handleIncreasePress={() => increaseSetpointSafe("upper")}
        marginHorizontal="l"
      />
    </Screen>
  );
}

export default withQueryData(useLocationNotificationsQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: () => {
    const route = useRoute<LocationHumidityNotificationProps["route"]>();
    return useMemo(() => ({ locationId: route.params.locationId }), [
      route.params.locationId,
    ]);
  },
})(LocationHumidityNotification);
