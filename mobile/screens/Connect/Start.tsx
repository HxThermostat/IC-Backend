import React from "react";

import { NavigationProp, useNavigation } from "@react-navigation/native";

import Onboarding from "~/components/Onboarding";
import Text from "~/components/Text";

import i18n from "~/i18n";

import { ConnectNavigatorRouteList } from "~/navigators/ConnectNavigator";
import { UnsupportedVariant, useFeatureFlags } from "~/contexts";
import {
  KohortFunnel,
  KohortFunnelEventStep,
  useKohortTracking,
} from "~/utils/kohort";

const scope = "Screens.Connect.Start";

export default function Start(): JSX.Element {
  const navigation = useNavigation<NavigationProp<ConnectNavigatorRouteList>>();
  const { handleFeature } = useFeatureFlags();
  const { trackFunnel } = useKohortTracking();

  const [route, steps] = handleFeature("connect", (variant, feature): [
    keyof ConnectNavigatorRouteList,
    number
  ] => {
    switch (variant) {
      case "AYLA_DISPLAY":
        return ["Instructions", 4];
      default:
        throw new UnsupportedVariant(feature, variant);
    }
  });

  return (
    <Onboarding
      Content={<Text textAlign="center">{i18n.t("body", { scope })}</Text>}
      button={{
        onPress: () => {
          if (route === "Instructions") {
            trackFunnel({
              funnel: KohortFunnel.Connection,
              step: KohortFunnelEventStep.ConnectionStart,
            });
          }
          navigation.navigate(route);
        },
      }}
      progress={{ dots: steps, activeIndex: 0 }}
      title={i18n.t("title", { scope })}
    />
  );
}
