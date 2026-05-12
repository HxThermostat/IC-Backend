import React from "react";
import { Platform, StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import Home from "~/screens/Authenticated/Home";

import {
  HomeTabIcon,
  ScheduleTabIcon,
  SettingsTabIcon,
} from "~/components/Icons";

import { useTheme } from "~/theme";
import i18n from "~/i18n";

import SettingsNavigator, {
  SettingsNavigatorRouteList,
} from "./SettingsNavigator";
import SchedulesNavigator, {
  SchedulesNavigatorRouteList,
} from "./SchedulesNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";
import { useKohortTracking } from "~/utils/kohort";

const scope = "Common";

export type TabNavigatorRouteList = {
  Home: {
    showModeModal?: boolean;
    showControllerModal?: boolean;
  };
  Schedules: NavigatorScreenParams<SchedulesNavigatorRouteList>;
  Settings: NavigatorScreenParams<SettingsNavigatorRouteList>;
};

const Tab =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator()
    : createBottomTabNavigator();

type TabProps = {
  focused: boolean;
  color: string;
};

type iOSTabScreen = ReturnType<typeof createBottomTabNavigator>["Screen"];
type androidTabScreen = ReturnType<
  typeof createMaterialBottomTabNavigator
>["Screen"];

// Like Hx, we get "JSX element type 'Tab.Screen' does not have any construct or call signatures" without explicitly typing it like this ^
const TabScreen = Tab.Screen as iOSTabScreen & androidTabScreen;

export default function TabNavigator(): JSX.Element {
  const { colors } = useTheme();
  const { trackFeatureUse } = useKohortTracking();
  return (
    <Tab.Navigator
      activeColor={colors.tint}
      inactiveColor={colors.tabInactive}
      barStyle={{
        ...Platform.select({
          android: {
            backgroundColor: colors.backgroundGradientEnd,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.tabInactive,
          },
          default: {},
        }),
      }}
      // material tab bar props above ^ - iOS tab props below
      tabBarOptions={{
        inactiveTintColor: colors.tabInactive,
        activeTintColor: colors.tint,
      }}
    >
      <TabScreen
        name={"Home"}
        initialParams={{ showControllerModal: false, showModeModal: false }}
        component={Home}
        options={{
          tabBarLabel: i18n.t("home", { scope }),
          tabBarAccessibilityLabel: i18n.t("home", { scope }),
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }: TabProps) => <HomeTabIcon color={color} />,
        }}
        listeners={{
          tabPress: () => trackFeatureUse("View Home"),
        }}
      />
      <TabScreen
        name={"Schedules"}
        component={SchedulesNavigator}
        options={{
          tabBarLabel: i18n.t("schedules", { scope }),
          tabBarAccessibilityLabel: i18n.t("schedules", { scope }),
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }: TabProps) => (
            <ScheduleTabIcon color={color} />
          ),
        }}
        listeners={{
          tabPress: () => trackFeatureUse("View Schedules"),
        }}
      />
      <TabScreen
        name={"Settings"}
        component={SettingsNavigator}
        options={{
          tabBarLabel: i18n.t("settings", { scope }),
          tabBarAccessibilityLabel: i18n.t("settings", { scope }),
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }: TabProps) => (
            <SettingsTabIcon color={color} />
          ),
        }}
        listeners={{
          tabPress: () => trackFeatureUse("View Settings"),
        }}
      />
    </Tab.Navigator>
  );
}
