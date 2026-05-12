import React, { useCallback } from "react";

import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import Onboarding from "~/components/Onboarding";
import Text from "~/components/Text";

import {
  UnsupportedVariant,
  useAuth,
  useControllerSafe,
  useFeatureFlags,
} from "~/contexts";

import i18n from "~/i18n";

import { ConnectNavigatorRouteList } from "~/navigators/ConnectNavigator";
import { useBackHandler } from "~/hooks";
const scope = "Screens.Connect.Success";

export default function Success(): JSX.Element {
  const { completeOnboarding, isOnboarding, reload } = useAuth();

  const { setLocationId } = useControllerSafe();

  const { handleFeature } = useFeatureFlags();

  const navigation = useNavigation<NavigationProp<ConnectNavigatorRouteList>>();

  useBackHandler(useCallback(() => true, []));

  const {
    params: { locationId },
  } = useRoute<RouteProp<ConnectNavigatorRouteList, "Success">>();

  const onPress = useCallback(async () => {
    await reload({ awaitLoad: false, hard: false });

    if (locationId) {
      await setLocationId(locationId);
    }

    if (isOnboarding) {
      await completeOnboarding();
    } else {
      navigation.dangerouslyGetParent()?.goBack();
    }
  }, [
    completeOnboarding,
    isOnboarding,
    locationId,
    navigation,
    reload,
    setLocationId,
  ]);

  const steps = handleFeature("connect", (variant, feature) => {
    switch (variant) {
      case "AYLA_DISPLAY":
        return 4;
      default:
        throw new UnsupportedVariant(feature, variant);
    }
  });

  return (
    <Onboarding
      Content={<Text textAlign="center">{i18n.t("body", { scope })}</Text>}
      button={{
        onPress,
        text: i18n.t("Common.done"),
      }}
      progress={{ dots: steps, activeIndex: steps - 1 }}
      title={i18n.t("title", { scope })}
    />
  );
}
