import React from "react";

import { NavigationProp, useNavigation } from "@react-navigation/native";

import Onboarding from "~/components/Onboarding";
import Text from "~/components/Text";

import i18n from "~/i18n";

import { ConnectNavigatorRouteList } from "~/navigators/ConnectNavigator";

const scope = "Screens.Connect.AylaDisplay.Instructions";

export default function Start(): JSX.Element {
  const navigation = useNavigation<NavigationProp<ConnectNavigatorRouteList>>();

  return (
    <Onboarding
      Content={
        <>
          <Text marginBottom="s">{i18n.t("item1", { scope })}</Text>
          <Text marginBottom="s">{i18n.t("item2", { scope })}</Text>
          <Text marginBottom="s">{i18n.t("item3", { scope })}</Text>
        </>
      }
      button={{
        onPress: () => navigation.navigate("Token"),
      }}
      progress={{ dots: 4, activeIndex: 1 }}
      title={i18n.t("title", { scope })}
    />
  );
}
