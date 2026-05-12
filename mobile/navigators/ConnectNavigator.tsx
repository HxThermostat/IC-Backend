import React from "react";
import { Platform } from "react-native";

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "react-native-screens/native-stack";

import { HeaderButton } from "~/components/Touchables";

import { UnsupportedVariant, useAuth, useFeatureFlags } from "~/contexts";

import i18n from "~/i18n";

import { useTheme } from "~/theme";

import Start from "~/screens/Connect/Start";
import Success from "~/screens/Connect/Success";

import AylaDisplayInstructions from "~/screens/Connect/AylaDisplay/Instructions";
import AylaDisplayToken from "~/screens/Connect/AylaDisplay/Token";

import { NavigationOptionsProp } from "./helpers";

type CommonRouteList = {
  Start: undefined;
  Success: { locationId: string };
};

type AylaDisplayRouteList = {
  Instructions: undefined;
  Token: undefined;
};

export type ConnectNavigatorRouteList = CommonRouteList & AylaDisplayRouteList;

const Stack = createNativeStackNavigator<ConnectNavigatorRouteList>();

/* eslint-disable @typescript-eslint/explicit-function-return-type */
// We're using these functions as a way to get around ReturnType not
// being able to work with generics (e.g. ReturnType<typeof foo<Bar>)
const buildAylaDisplayStack = () =>
  createNativeStackNavigator<AylaDisplayRouteList>();
/* eslint-enable @typescript-eslint/explicit-function-return-type */

const ADStack = Stack as ReturnType<typeof buildAylaDisplayStack>;

export default function ConnectNavigator(): JSX.Element {
  const { isOnboarding, signOut } = useAuth();
  const { handleFeature } = useFeatureFlags();
  const { colors } = useTheme();

  const headerOptions = Platform.select<NativeStackNavigationOptions>({
    default: {
      headerHideShadow: true,
      headerStyle: { backgroundColor: colors.backgroundGradientStart },
      headerTitleStyle: { color: colors.backgroundGradientStart },
    },
  });

  return (
    <Stack.Navigator initialRouteName={"Start"}>
      <Stack.Screen
        name="Start"
        component={Start}
        options={({ navigation }: NavigationOptionsProp) => ({
          ...headerOptions,
          // eslint-disable-next-line react/display-name
          headerLeft: () =>
            isOnboarding ? null : (
              <HeaderButton
                text={i18n.t("Common.cancel")}
                onPress={() => navigation.goBack()}
              />
            ),
          // eslint-disable-next-line react/display-name
          headerRight: () =>
            isOnboarding ? (
              <HeaderButton text={i18n.t("Common.signOut")} onPress={signOut} />
            ) : null,
        })}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
        }}
      />

      {handleFeature("connect", (variant, feature) => {
        switch (variant) {
          case "AYLA_DISPLAY":
            return (
              <>
                <ADStack.Screen
                  name="Instructions"
                  component={AylaDisplayInstructions}
                  options={headerOptions}
                />
                <ADStack.Screen
                  name="Token"
                  component={AylaDisplayToken}
                  options={headerOptions}
                />
              </>
            );
          default:
            throw new UnsupportedVariant(feature, variant);
        }
      })}
    </Stack.Navigator>
  );
}
