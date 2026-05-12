import React from "react";

import { Platform } from "react-native";

import { useIsTabNavigator } from "~/hooks";

import Badgeable from "../Badgeable";

import Box, { Row } from "../Box";

import { Touchable } from "../Touchables";

import { SettingsIcon } from "./VectorIcon";

interface HomeSettingsIconProps {
  badgeVisible: boolean;
  onPress: () => void;
}
export const HomeSettingsIcon = ({
  badgeVisible,
  onPress,
}: HomeSettingsIconProps): JSX.Element | null => {
  const usesTabNavigator = useIsTabNavigator();
  if (usesTabNavigator) {
    return (
      // we keep the vertical padding so that it functions more as a `largeTitle`, since the top level screens will have largeTitle enabled
      <Box paddingVertical={Platform.select({ android: "xxs", ios: "m" })} />
    );
  }
  return (
    <Row justifyContent="flex-end" paddingVertical="s">
      <Badgeable visible={badgeVisible}>
        <Touchable onPress={onPress}>
          <SettingsIcon size={22} color="text" />
        </Touchable>
      </Badgeable>
    </Row>
  );
};
