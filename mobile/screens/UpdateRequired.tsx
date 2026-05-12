import React from "react";

import { Platform } from "react-native";

import i18n from "~/i18n";

import Screen from "~/components/Screen";
import Text from "~/components/Text";

const scope = "Screens.Unauthenticated.UpdateRequired";

export default function UpdateRequired(): JSX.Element {
  return (
    <Screen justifyContent="center" alignItems="center">
      <Text variant="largeTitle" textAlign="center">
        {i18n.t("updateRequired", { scope })}
      </Text>
      <Text marginTop="l" textAlign="center">
        {i18n.t("downloadUpdate", {
          scope,
          store: Platform.select({ android: "Play Store", ios: "App Store" }),
        })}
      </Text>
    </Screen>
  );
}
