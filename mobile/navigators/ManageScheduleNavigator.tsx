import React from "react";

import { createNativeStackNavigator } from "react-native-screens/native-stack";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import ManageSchedule, {
  NewSchedule,
} from "~/screens/Schedules/ManageSchedule";
import ManageTemperaturePreset, {
  ManageTemperaturePresetRouteParams,
  NewTemperaturePreset,
} from "~/screens/Schedules/ManageTemperaturePreset";
import SelectFanMode, {
  SelectFanModeRouteParams,
} from "~/screens/Schedules/SelectFanMode";

import i18n from "~/i18n";

import { Day } from "~/graph";

export type ManageScheduleNavigatorRouteList = {
  ManageSchedule: {
    scheduleId?: string;
    day?: Day;
  };
  NewSchedule: {
    scheduleId?: string;
    day?: Day;
  };
  ManageTemperaturePreset: ManageTemperaturePresetRouteParams;
  NewTemperaturePreset: ManageTemperaturePresetRouteParams;
  SelectFanMode: SelectFanModeRouteParams;
};

const Stack = createNativeStackNavigator<ManageScheduleNavigatorRouteList>();

const scope = "Screens.Authenticated.SchedulesNavigator";

export default function ManageScheduleNavigator(): JSX.Element {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        initialRouteName={"ManageSchedule"}
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          options={{ title: "" }}
          name="ManageSchedule"
          component={ManageSchedule}
        />
        <Stack.Screen
          options={{ title: "" }}
          name="NewSchedule"
          component={NewSchedule}
        />
        <Stack.Screen
          options={{
            title: "",
          }}
          name="ManageTemperaturePreset"
          component={ManageTemperaturePreset}
        />
        <Stack.Screen
          options={{
            title: "",
          }}
          name="NewTemperaturePreset"
          component={NewTemperaturePreset}
        />
        <Stack.Screen
          options={{
            title: i18n.t("Fan.title", { scope }),
          }}
          name="SelectFanMode"
          component={SelectFanMode}
        />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
