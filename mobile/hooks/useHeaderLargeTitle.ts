import { useMemo } from "react";

import { Platform } from "react-native";

import { NativeStackNavigationOptions } from "react-native-screens/native-stack";

import { useTheme } from "~/theme";

import { useIsTabNavigator } from "./useIsTabNavigator";

type LargeTitleConfig = {
  headerLargeTitle?: NativeStackNavigationOptions["headerLargeTitle"];
  headerLargeStyle?: NativeStackNavigationOptions["headerLargeStyle"];
  headerLargeTitleStyle?: NativeStackNavigationOptions["headerLargeTitleStyle"];
  headerTitleStyle?: NativeStackNavigationOptions["headerTitleStyle"];
  headerHideShadow?: NativeStackNavigationOptions["headerHideShadow"];
  headerStyle?: NativeStackNavigationOptions["headerStyle"];
};
export const useHeaderLargeTitle = (): LargeTitleConfig => {
  const { colors, textVariants } = useTheme();
  const isTabNavigator = useIsTabNavigator();

  const result = useMemo(
    () =>
      isTabNavigator
        ? {
            headerLargeTitle: true,
            headerLargeStyle: {
              backgroundColor: colors.backgroundGradientStart,
            },
            headerLargeTitleStyle: {
              ...textVariants.largeTitle,
              color: colors.text,
            },
            // android specific treatments
            headerTitleStyle: Platform.select({
              android: {
                ...textVariants.largeTitle,
                color: colors.text,
              },
              default: undefined,
            }),
            headerHideShadow: Platform.select({
              android: true,
              default: undefined,
            }),
            headerStyle: {
              backgroundColor: Platform.select({
                android: "transparent",
                default: undefined,
              }),
            },
          }
        : {},
    [
      isTabNavigator,
      colors.text,
      colors.backgroundGradientStart,
      textVariants.largeTitle,
    ]
  );

  return result;
};
