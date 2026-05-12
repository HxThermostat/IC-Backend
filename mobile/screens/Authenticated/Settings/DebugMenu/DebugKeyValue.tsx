import React, { useLayoutEffect } from "react";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp } from "@react-navigation/native";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import Screen from "~/components/Screen";
import Text from "~/components/Text";

export type DebugKeyValueProps = {
  navigation: NativeStackNavigationProp<
    SettingsNavigatorRouteList,
    "DebugKeyValue"
  >;
  route: RouteProp<SettingsNavigatorRouteList, "DebugKeyValue">;
};

function DebugKeyValue({ navigation, route }: DebugKeyValueProps): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.key,
    });
  }, [navigation, route.params.key]);

  return (
    <Screen>
      <Text variant="heading">{route.params.key}</Text>
      <Text selectable={true}>{route.params.value}</Text>
    </Screen>
  );
}

export default DebugKeyValue;
