import React from "react";

import AuthenticatedNavigator from "./AuthenticatedNavigator";
import ConnectNavigator from "./ConnectNavigator";
import UnauthenticatedNavigator from "./UnauthenticatedNavigator";

import { createNativeStackNavigator } from "react-native-screens/native-stack";

export type AppNavigatorRouteList = {
  Authenticated: undefined;
  Unauthenticated: undefined;
  Connect: undefined;
};

const Stack = createNativeStackNavigator<AppNavigatorRouteList>();

export const AuthenticatedNavigatorContainer = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Authenticated" component={AuthenticatedNavigator} />
  </Stack.Navigator>
);

export const UnauthenticatedNavigatorContainer = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Unauthenticated" component={UnauthenticatedNavigator} />
  </Stack.Navigator>
);
export const OnbooardingNavigatorContainer = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Connect" component={ConnectNavigator} />
  </Stack.Navigator>
);
