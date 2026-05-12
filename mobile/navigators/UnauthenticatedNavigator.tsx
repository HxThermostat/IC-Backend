import React from "react";

import { createNativeStackNavigator } from "react-native-screens/native-stack";

import { UnsupportedVariant, useFeatureFlags } from "~/contexts";

import i18n from "~/i18n";

import EnterEmailAddress from "~/screens/Unauthenticated/EnterEmailAddress";
import EnterEmailConfirmation from "~/screens/Unauthenticated/EnterEmailConfirmation";
import EnterNewSignUpInfo from "~/screens/Unauthenticated/EnterNewSignUpInfo";

import { useTheme } from "~/theme";

export type UnauthenticatedNavigatorRouteList = {
  EnterEmailAddress: undefined;
  EnterEmailConfirmation: {
    email: string;
    emailToken?: string; // the deep link will contain the token and the email
  };
  EnterNewSignUpInfo: {
    email: string;
  };
};

const scope = "Screens.Unauthenticated";

const Stack = createNativeStackNavigator<UnauthenticatedNavigatorRouteList>();

export default function UnauthenticatedNavigator(): JSX.Element {
  const { handleFeature } = useFeatureFlags();
  const { colors } = useTheme();

  return handleFeature("signIn", (variant, feature) => {
    switch (variant) {
      case "TOKEN":
        return (
          <Stack.Navigator
            initialRouteName="EnterEmailAddress"
            screenOptions={{
              headerHideShadow: true,
              headerStyle: { backgroundColor: colors.backgroundGradientStart },
              headerTitleStyle: { color: colors.backgroundGradientStart },
            }}
          >
            <Stack.Screen
              name="EnterEmailAddress"
              options={{
                title: i18n.t("screenTitle", {
                  scope: `${scope}.EnterEmailAddress`,
                }),
              }}
              component={EnterEmailAddress}
            />
            <Stack.Screen
              name="EnterNewSignUpInfo"
              options={{
                title: i18n.t("screenTitle", {
                  scope: `${scope}.EnterNewSignUpInfo`,
                }),
              }}
              component={EnterNewSignUpInfo}
            />
            <Stack.Screen
              name="EnterEmailConfirmation"
              options={{
                title: i18n.t("screenTitle", {
                  scope: `${scope}.EnterEmailConfirmation`,
                }),
              }}
              component={EnterEmailConfirmation}
            />
          </Stack.Navigator>
        );
      default:
        throw new UnsupportedVariant(feature, variant);
    }
  });
}
