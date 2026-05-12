import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { Platform, StatusBar } from "react-native";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

import {
  UnsupportedVariant,
  useDeviceContext,
  useFeatureFlags,
} from "~/contexts";
import { useIsTabNavigator, useHeaderLargeTitle } from "~/hooks";
import Settings from "~/screens/Authenticated/Settings";
import About from "~/screens/Authenticated/Settings/About";
import AccountSharing from "~/screens/Authenticated/Settings/Account/AccountSharing";
import ManageAccount from "~/screens/Authenticated/Settings/Account/ManageAccount";
import {
  AdjustController,
  AdjustLocation,
} from "~/screens/Authenticated/Settings/Away/AdjustAway";
import Away from "~/screens/Authenticated/Settings/Away/Away";
import Geofence from "~/screens/Authenticated/Settings/Away/Geofence";
import ChangeGraphUrl from "~/screens/Authenticated/Settings/DebugMenu/ChangeGraphUrl";
import DebugKeyValue from "~/screens/Authenticated/Settings/DebugMenu/DebugKeyValue";
import DebugMenuHome from "~/screens/Authenticated/Settings/DebugMenu/DebugMenuHome";
import DebugUser from "~/screens/Authenticated/Settings/DebugMenu/DebugUser";
import FaultLogDescription from "~/screens/Authenticated/Settings/FaultLogDescription";
import FaultLogsLocation from "~/screens/Authenticated/Settings/FaultLogsLocation";
import HoldLength from "~/screens/Authenticated/Settings/HoldLength";
import Location from "~/screens/Authenticated/Settings/Location";
import Names from "~/screens/Authenticated/Settings/Names";
import LocationFaultsNotification from "~/screens/Authenticated/Settings/Notifications/LocationFaultsNotification";
import LocationHumidityNotification from "~/screens/Authenticated/Settings/Notifications/LocationHumidityNotification";
import LocationTemperatureNotification from "~/screens/Authenticated/Settings/Notifications/LocationTemperatureNotification";
import RenameLocation from "~/screens/Authenticated/Settings/RenameLocation";
import RenameRoom from "~/screens/Authenticated/Settings/RenameRoom";
import RoomNames from "~/screens/Authenticated/Settings/RoomNames";
import Support from "~/screens/Authenticated/Settings/Support";
import ListTemperaturePresets from "~/screens/Schedules/ListTemperaturePresets";
import ManageTemperaturePreset, {
  ManageTemperaturePresetRouteParams,
  NewTemperaturePreset,
} from "~/screens/Schedules/ManageTemperaturePreset";
import SelectFanMode, {
  SelectFanModeRouteParams,
} from "~/screens/Schedules/SelectFanMode";

import i18n from "~/i18n";

type CommonRouteList = {
  Settings: undefined;
  About: undefined;
  Support: undefined;
  Names: { locationId: string };
  RoomNames: { locationId: string };
  RenameLocation: { locationId: string };
  RenameRoom: { controllerId: string };
  Location: { locationId: string };
  HoldLength: { locationId: string };
  FaultLogsLocation: { locationId: string };
  FaultLogDescription: { locationId: string; index: number };
};

type AccountRouteList = {
  ManageAccount: undefined;
  AccountSharing: undefined;
};

type NotificationsRouteList = {
  ListTemperatures: { locationId: string };
  ListHumidities: { locationId: string };
  LocationFaultsNotification: { locationId: string };
  LocationTemperatureNotification: { locationId: string };
  LocationHumidityNotification: { locationId: string };
};
type AwayLocationRouteList = {
  Away: { locationId: string };
  AwayLocation: { locationId: string };
  Geofence: { locationId: string };
};

type AwayControllerRouteList = {
  Away: { locationId: string };
  AwayController: { controllerId: string };
  Geofence: { locationId: string };
};

type SchedulesRouteList = {
  ListTemperaturePresets: {
    locationId: string;
  };
  ManageTemperaturePreset: ManageTemperaturePresetRouteParams;
  NewTemperaturePreset: ManageTemperaturePresetRouteParams;
  SelectFanMode: SelectFanModeRouteParams;
};

type DebugMenuRouteList = {
  DebugMenuHome: undefined;
  ChangeGraphUrl: undefined;
  DebugUser: undefined;
  DebugKeyValue: {
    key: string;
    value: string;
  };
};

export type SettingsNavigatorRouteList = CommonRouteList &
  AccountRouteList &
  AwayLocationRouteList &
  AwayControllerRouteList &
  NotificationsRouteList &
  SchedulesRouteList &
  DebugMenuRouteList;

const Stack = createNativeStackNavigator<CommonRouteList>();

/* eslint-disable @typescript-eslint/explicit-function-return-type */
// We're using these functions as a way to get around ReturnType not
// being able to work with generics (e.g. ReturnType<typeof foo<Bar>)
const buildAwayLocationStack = () =>
  createNativeStackNavigator<AwayLocationRouteList>();
const buildAccountStack = () => createNativeStackNavigator<AccountRouteList>();
const buildAwayControllerStack = () =>
  createNativeStackNavigator<AwayControllerRouteList>();
const buildNotificationsControllerStack = () =>
  createNativeStackNavigator<NotificationsRouteList>();
const buildSchedulesStack = () =>
  createNativeStackNavigator<SchedulesRouteList>();
const buildDebugMenuStack = () =>
  createNativeStackNavigator<DebugMenuRouteList>();
/* eslint-enable @typescript-eslint/explicit-function-return-type */

const AccountStack = Stack as ReturnType<typeof buildAccountStack>;
const AwayLocationStack = Stack as ReturnType<typeof buildAwayLocationStack>;
const AwayControllerStack = Stack as ReturnType<
  typeof buildAwayControllerStack
>;
const NotificationStack = Stack as ReturnType<
  typeof buildNotificationsControllerStack
>;
const SchedulesStack = Stack as ReturnType<typeof buildSchedulesStack>;
const DebugMenuStack = Stack as ReturnType<typeof buildDebugMenuStack>;

const scope = "Screens.Authenticated.SettingsNavigator";

export default function SettingsNavigator(): JSX.Element {
  const { handleEnabledFeature } = useFeatureFlags();
  const { isIpad } = useDeviceContext();
  const isTabNavigator = useIsTabNavigator();
  const largeTitleProps = useHeaderLargeTitle();

  return (
    <BottomSheetModalProvider>
      {Platform.OS === "ios" && !isIpad && !isTabNavigator && (
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={"transparent"}
          translucent={true}
          animated={true}
        />
      )}
      <Stack.Navigator initialRouteName={"Settings"}>
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: i18n.t("Settings.screenTitle", { scope }),
            ...largeTitleProps,
          }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{ title: i18n.t("About.screenTitle", { scope }) }}
        />
        <Stack.Screen
          name="Support"
          component={Support}
          options={{ title: i18n.t("Support.screenTitle", { scope }) }}
        />
        <Stack.Screen
          name="Names"
          component={Names}
          options={{ title: i18n.t("Names.screenTitle", { scope }) }}
        />
        <Stack.Screen
          name="RoomNames"
          component={RoomNames}
          options={{ title: i18n.t("RoomNames.screenTitle", { scope }) }}
        />
        <Stack.Screen
          name="RenameLocation"
          component={RenameLocation}
          options={{ title: i18n.t("RenameLocation.screenTitle", { scope }) }}
        />
        <Stack.Screen
          name="RenameRoom"
          component={RenameRoom}
          options={{ title: i18n.t("RenameRoom.screenTitle", { scope }) }}
        />
        <Stack.Screen
          name="HoldLength"
          component={HoldLength}
          options={{ title: i18n.t("HoldLength.screenTitle", { scope }) }}
        />
        <Stack.Screen
          name="Location"
          component={Location}
          options={{ title: i18n.t("Location.screenTitle", { scope }) }}
        />

        <AccountStack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{ title: i18n.t("ManageAccount.screenTitle", { scope }) }}
        />
        <AccountStack.Screen
          name="AccountSharing"
          component={AccountSharing}
          options={{ title: i18n.t("AccountSharing.screenTitle", { scope }) }}
        />

        {handleEnabledFeature("faultLogsLocation", (variant) => {
          return (
            <>
              {(variant === "LOG_WITH_LABEL" ||
                variant === "LOG_WITH_LABEL_AND_DESCRIPTION") && (
                <Stack.Screen
                  name="FaultLogsLocation"
                  component={FaultLogsLocation}
                  options={{
                    title: i18n.t("FaultLogsLocation.screenTitle", { scope }),
                  }}
                />
              )}
              {variant === "LOG_WITH_LABEL_AND_DESCRIPTION" && (
                <Stack.Screen
                  name="FaultLogDescription"
                  component={FaultLogDescription}
                  options={{
                    title: i18n.t("FaultLogDescription.screenTitle", {
                      scope,
                    }),
                  }}
                />
              )}
            </>
          );
        })}

        {handleEnabledFeature("away", (variant, feature) => {
          if (variant.includes("AWAY_CONTROLLER")) {
            return (
              <>
                <AwayControllerStack.Screen
                  name="Away"
                  component={Away}
                  options={{ title: i18n.t("Away.screenTitle", { scope }) }}
                />
                <AwayControllerStack.Screen
                  name="AwayController"
                  component={AdjustController}
                  options={{
                    title: i18n.t("AdjustAway.screenTitle", { scope }),
                  }}
                />
                <AwayControllerStack.Screen
                  name="Geofence"
                  component={Geofence}
                  options={{ title: i18n.t("Geofence.screenTitle", { scope }) }}
                />
              </>
            );
          } else if (variant.includes("AWAY_LOCATION")) {
            return (
              <>
                <AwayLocationStack.Screen
                  name="Away"
                  component={Away}
                  options={{ title: i18n.t("Away.screenTitle", { scope }) }}
                />
                <AwayLocationStack.Screen
                  name="AwayLocation"
                  component={AdjustLocation}
                  options={{
                    title: i18n.t("AdjustAway.screenTitle", { scope }),
                  }}
                />
                <AwayLocationStack.Screen
                  name="Geofence"
                  component={Geofence}
                  options={{ title: i18n.t("Geofence.screenTitle", { scope }) }}
                />
              </>
            );
          }
          throw new UnsupportedVariant(feature, variant);
        })}
        {handleEnabledFeature("schedule", () => {
          return (
            <>
              <SchedulesStack.Screen
                options={{
                  title: i18n.t("ListTemperaturePresets.screenTitle", {
                    scope,
                  }),
                }}
                name="ListTemperaturePresets"
                component={ListTemperaturePresets}
              />

              <SchedulesStack.Screen
                options={{ title: "" }}
                name="ManageTemperaturePreset"
                component={ManageTemperaturePreset}
              />
              <SchedulesStack.Screen
                options={{ title: "" }}
                name="NewTemperaturePreset"
                component={NewTemperaturePreset}
              />
              <SchedulesStack.Screen
                options={{
                  title: i18n.t("SelectFanMode.screenTitle", { scope }),
                }}
                name="SelectFanMode"
                component={SelectFanMode}
              />
            </>
          );
        })}
        {handleEnabledFeature("notifications", (variant) => {
          return (
            <>
              {variant.includes("LOCATION_FAULTS") && (
                <NotificationStack.Screen
                  name="LocationFaultsNotification"
                  options={{
                    title: i18n.t("LocationFaultsNotification.screenTitle", {
                      scope,
                    }),
                  }}
                  component={LocationFaultsNotification}
                />
              )}
              {variant.includes("LOCATION_TEMPERATURE") && (
                <NotificationStack.Screen
                  name="LocationTemperatureNotification"
                  options={{
                    title: i18n.t(
                      "LocationTemperatureNotification.screenTitle",
                      {
                        scope,
                      }
                    ),
                  }}
                  component={LocationTemperatureNotification}
                />
              )}
              {variant.includes("LOCATION_HUMIDITY") && (
                <NotificationStack.Screen
                  name="LocationHumidityNotification"
                  options={{
                    title: i18n.t("LocationHumidityNotification.screenTitle", {
                      scope,
                    }),
                  }}
                  component={LocationHumidityNotification}
                />
              )}
            </>
          );
        })}
        <>
          <DebugMenuStack.Screen
            name="DebugMenuHome"
            options={{
              title: i18n.t("DebugMenuHome.screenTitle", {
                scope,
              }),
            }}
            component={DebugMenuHome}
          />
          <DebugMenuStack.Screen
            name="ChangeGraphUrl"
            options={{
              title: i18n.t("ChangeGraphUrl.screenTitle", {
                scope,
              }),
            }}
            component={ChangeGraphUrl}
          />
          <DebugMenuStack.Screen
            name="DebugUser"
            options={{
              title: i18n.t("DebugUser.screenTitle", {
                scope,
              }),
            }}
            component={DebugUser}
          />
          <DebugMenuStack.Screen
            name="DebugKeyValue"
            component={DebugKeyValue}
          />
        </>
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
