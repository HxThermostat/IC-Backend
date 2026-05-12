import React, { useEffect, useMemo, useRef } from "react";

import { setBadgeCountAsync, setNotificationHandler } from "expo-notifications";

import { createNativeStackNavigator } from "react-native-screens/native-stack";

import { useTheme } from "~/theme";

import {
  NavigationContainer,
  NavigationContainerRef,
  DarkTheme as RNDarkTheme,
  Theme as NavigationThemeType,
  DefaultTheme as RNDefaultTheme,
} from "@react-navigation/native";

import { useAuth } from "~/contexts";

import { usePushTokenListener } from "~/utils/notifications";

import SplashScreen from "~/screens/Splash";
import UpdateRequired from "~/screens/UpdateRequired";

import { withBackground } from "~/components/Background";

import deepLinkingConfig, { NavigatorType } from "~/utils/deeplinking";

import { useIsTabNavigator } from "~/hooks";

import {
  AuthenticatedNavigatorContainer,
  OnbooardingNavigatorContainer,
  UnauthenticatedNavigatorContainer,
} from "./AppNavigator";

import { handleScreenChange } from "./helpers";

export type RootNavigatorRouteList = {
  App: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorRouteList>();

const RootNavigator = (): JSX.Element => {
  const {
    bootstrap,
    isLoading,
    isSignout,
    isOnboarding,
    isUpdateRequired,
  } = useAuth();

  // This should run just once when the app boots, if the bootstrap
  // needs to be re-executed (e.g. after a subsequent sign in), it
  // will need to be called manually
  useEffect(() => {
    void (async () => {
      await bootstrap();
    })();
  }, [bootstrap]);

  const { colors, isDarkTheme } = useTheme();
  const MainNavigator = useRef<NavigationContainerRef>(null);
  const currentRouteNameRef = useRef<string>();
  const usesTabNavigator = useIsTabNavigator();

  function handleNavigationStateChange(): void {
    const previousRouteName = currentRouteNameRef.current;
    const currentRouteName = MainNavigator?.current?.getCurrentRoute()?.name;
    if (previousRouteName !== currentRouteName) {
      handleScreenChange(currentRouteName, previousRouteName);
    }
    currentRouteNameRef.current = currentRouteName;
  }

  const navigationTheme: NavigationThemeType = useMemo(() => {
    const baseTheme = isDarkTheme ? RNDarkTheme : RNDefaultTheme;

    return {
      ...baseTheme,
      dark: isDarkTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.tint,
      },
    };
  }, [isDarkTheme, colors.tint]);

  useEffect(() => {
    setNotificationHandler({
      handleNotification: (notification) => {
        // For now, we're ignore local notifications when the app is
        // in the foreground
        const ignore = notification.request.trigger.type === "unknown";
        return Promise.resolve({
          shouldShowAlert: !ignore,
          shouldPlaySound: !ignore,
          shouldSetBadge: !ignore,
        });
      },
    });
    // We're not setting the badge count in any of the notifications
    // we send, so this really just a UX belt-and-suspenders to avoid
    // confusing users
    void setBadgeCountAsync(0);
  }, []);

  // Listen for changes to the device's pushToken
  usePushTokenListener();

  const AppNavigator = useMemo(() => {
    switch (true) {
      case isSignout:
        return UnauthenticatedNavigatorContainer;
      case isOnboarding:
        return OnbooardingNavigatorContainer;
      default:
        return AuthenticatedNavigatorContainer;
    }
  }, [isSignout, isOnboarding]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isUpdateRequired) {
    return <UpdateRequired />;
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
      ref={MainNavigator}
      linking={deepLinkingConfig({
        navigator: usesTabNavigator ? NavigatorType.TAB : NavigatorType.STACK,
      })}
      onStateChange={handleNavigationStateChange}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="App" component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default withBackground(RootNavigator);
