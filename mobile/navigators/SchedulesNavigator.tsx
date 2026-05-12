import React from "react";

import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigatorScreenParams } from "@react-navigation/core";

import ManageScheduleNavigator, {
  ManageScheduleNavigatorRouteList,
} from "./ManageScheduleNavigator";

import CopySchedule from "~/screens/Schedules/CopySchedule";
import Schedules from "~/screens/Schedules/Schedules";

import { Day } from "~/graph";
import i18n from "~/i18n";

import { useHeaderLargeTitle } from "~/hooks";

export type SchedulesNavigatorRouteList = {
  Schedules: undefined;
  CopySchedule: {
    day: Day;
  };
  ManageSchedule: NavigatorScreenParams<ManageScheduleNavigatorRouteList>;
};

const Stack = createNativeStackNavigator<SchedulesNavigatorRouteList>();

const scope = "Screens.Authenticated.SchedulesNavigator";

export default function SchedulesNavigator(): JSX.Element {
  const largeTitleProps = useHeaderLargeTitle();
  return (
    <Stack.Navigator initialRouteName={"Schedules"}>
      <Stack.Screen
        options={{
          title: i18n.t("Schedules.title", { scope }),
          ...largeTitleProps,
        }}
        name="Schedules"
        component={Schedules}
      />
      <Stack.Screen
        options={{
          title: "",
          stackPresentation: "modal",
          headerShown: false,
        }}
        name="ManageSchedule"
        component={ManageScheduleNavigator}
      />
      <Stack.Screen
        options={{
          title: i18n.t("CopySchedule.title", { scope }),
          stackPresentation: "modal",
          headerShown: true,
        }}
        name="CopySchedule"
        component={CopySchedule}
      />
    </Stack.Navigator>
  );
}
