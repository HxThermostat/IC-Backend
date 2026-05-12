import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useMemo } from "react";
import { Alert, GestureResponderEvent, Linking } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import {
  SelectModeModal,
  SelectControllerModal,
  SurveyChatModal,
  useModalRef,
} from "~/components/BottomSheets";
import Box, { VSpacer } from "~/components/Box";
import ControlledDial from "~/components/Dial/ControlledDial";
import { BackToSchedule } from "~/components/Home/BackToSchedule";
import { FanSpeed } from "~/components/Home/FanSpeed";
import { SystemMode } from "~/components/Home/SystemMode";
import TitleBar from "~/components/Home/TitleBar";
import Screen from "~/components/Screen";
import { SurveyPrompt } from "~/components/Survey/SurveyPrompt";
import { ModeButton } from "~/components/Touchables";
import { UnsupportedVariant, useController, useFeatureFlags } from "~/contexts";
import { useIsTabNavigator } from "~/hooks";

import {
  WithQueryDataProps,
  GoBack,
  useHomeQuery,
  withQueryData,
  useCancelHoldMutation,
} from "~/graph";

import i18n from "~/i18n";

import { checkGeofence } from "~/utils/background-tasks";

import { URI_SCHEME } from "~/config/constants";
import { AuthenticatedNavigatorRouteList } from "~/navigators/AuthenticatedNavigator";
import { useKohortTracking } from "~/utils/kohort";

const scope = "Screens.Authenticated.Home";

export type HomeProps = {
  navigation: NativeStackNavigationProp<
    AuthenticatedNavigatorRouteList,
    "Home"
  >;
  route: RouteProp<AuthenticatedNavigatorRouteList, "Home">;
} & WithQueryDataProps<typeof useHomeQuery>;

function Home({
  data: { controller, locations, me },
  navigation,
  route,
}: HomeProps): JSX.Element {
  if (!controller) {
    throw new GoBack();
  }

  if (!me) {
    throw new GoBack();
  }

  const { locationCount } = useController();
  const { handleEnabledFeature } = useFeatureFlags();
  const isTabNavigator = useIsTabNavigator();
  const { trackFeatureUse } = useKohortTracking();

  useFocusEffect(
    useCallback(() => {
      // We need to apply a small delay here so that the notification
      // handler can run first
      const handle = setTimeout(
        () => void checkGeofence(controller.location.id),
        1500
      );
      return () => clearTimeout(handle);
    }, [controller.location.id])
  );

  const [cancelHoldMutation] = useCancelHoldMutation({
    variables: { controllerId: controller.id },
  });

  const cancelHold = useCallback(() => {
    void cancelHoldMutation();
    trackFeatureUse("Back to Schedule");
  }, [cancelHoldMutation, trackFeatureUse]);

  const selectModeModalRef = useModalRef();
  const selectControllerModalRef = useModalRef();
  const surveyChatModalRef = useModalRef();

  useLayoutEffect(() => {
    if (route.params.showModeModal) {
      selectModeModalRef?.current?.present();
      navigation.setParams({ showModeModal: false });
    }
    if (route.params.showControllerModal) {
      selectControllerModalRef?.current?.present();
      navigation.setParams({ showControllerModal: false });
    }
  }, [route.params, navigation, selectModeModalRef, selectControllerModalRef]);

  const linkToAway = useCallback(() => {
    return handleEnabledFeature("away", (variant, feature) => {
      if (variant.includes("AWAY_CONTROLLER")) {
        void Linking.openURL(
          `${URI_SCHEME}://settings/adjustControllerAway/${locationCount}/${controller.location.id}/${controller.id}`
        );
      } else if (variant.includes("AWAY_LOCATION")) {
        void Linking.openURL(
          `${URI_SCHEME}://settings/adjustLocationAway/${locationCount}/${controller.location.id}`
        );
      } else {
        throw new UnsupportedVariant(feature, variant);
      }
    });
  }, [
    handleEnabledFeature,
    locationCount,
    controller.location.id,
    controller.id,
  ]);

  const displayAdjustAwayAlert = useCallback(() => {
    Alert.alert(
      i18n.t("awayModeAlert.title", { scope }),
      i18n.t("awayModeAlert.message", { scope }),
      [
        {
          text: i18n.t("awayModeAlert.cancel", { scope }),
          style: "cancel",
        },
        {
          text: i18n.t("awayModeAlert.openSettings", { scope }),
          style: "default",
          onPress: linkToAway,
        },
      ]
    );
  }, [linkToAway]);

  const awayActive =
    controller?.away?.active || controller?.location?.away?.active;

  // Prevent children to respond to touches when mode is enabled
  const onStartShouldSetResponderCapture = useCallback(
    (ev: GestureResponderEvent) => {
      if (awayActive) {
        ev.stopPropagation();
        displayAdjustAwayAlert();
        return true;
      }
      return false;
    },
    [awayActive, displayAdjustAwayAlert]
  );

  let fanSpeed: number | string | undefined;

  switch (controller.fan?.__typename) {
    case "PercentageFan":
      fanSpeed = controller.fan.activeSpeedPercent;
      break;
    case "SpeedNameFan":
      fanSpeed = controller.fan.activeSpeedName ?? undefined;
      break;
    default:
      // We don't have a default value for new fan types
      break;
  }

  return (
    <>
      <Screen
        paddingHorizontal="z"
        edges={isTabNavigator ? ["top", "right", "left"] : undefined}
      >
        <TitleBar
          showBadge={locations.some((location) => location.faultActive)}
          onPressSettingsIcon={() =>
            navigation.navigate("Settings", {
              screen: "Settings",
            })
          }
          onPressChangeController={() =>
            selectControllerModalRef?.current?.present()
          }
          title={controller.name}
          humidityAmbient={controller.humidityAmbient ?? undefined}
          temperatureOutdoor={
            controller.location.temperatureOutdoor ?? undefined
          }
          temperatureUnit={controller.location.temperatureUnit}
        />

        <Box alignContent="center" flexGrow={1} paddingHorizontal="l">
          <VSpacer flexGrow={3} />
          <Box
            alignContent="center"
            justifyContent="center"
            onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
          >
            <ControlledDial />
          </Box>

          <VSpacer />
          <Box flexGrow={2} justifyContent="space-around">
            <ModeButton
              awayActive={awayActive}
              mode={controller.mode.effectiveMode}
              connectionStatus={controller.location.connectionStatus}
              onPress={() => selectModeModalRef?.current?.present()}
            />
            <SystemMode call={controller.call} />
            <FanSpeed speed={controller.call ? undefined : fanSpeed} />
            <BackToSchedule
              activeHold={!!controller.activeHold}
              connectionStatus={controller.location.connectionStatus}
              onPressBackToSchedule={cancelHold}
            />
          </Box>
        </Box>
      </Screen>
      <SelectModeModal ref={selectModeModalRef} />
      <SelectControllerModal ref={selectControllerModalRef} />
      <SurveyChatModal ref={surveyChatModalRef} />
    </>
  );
}

export default withQueryData(useHomeQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: ({ controllerId }) =>
    useMemo(() => ({ controllerId }), [controllerId]),
})(Home);
