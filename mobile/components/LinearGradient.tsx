import React, { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";

import RNLinearGradient, {
  LinearGradientProps as RNLinearGradientProps,
} from "react-native-linear-gradient";

import { ThemeColor, useThemeColor } from "~/theme";

export type LinearGradientProps = PropsWithChildren<
  Pick<RNLinearGradientProps, "locations" | "start" | "end"> & {
    colors: [ThemeColor, ThemeColor];
    style?: StyleProp<ViewStyle>;
    testID?: string;
  }
>;

export default function LinearGradient({
  children,
  colors: themeColors,
  ...gradientProps
}: LinearGradientProps): JSX.Element {
  const colors = useThemeColor(themeColors);
  return (
    <RNLinearGradient colors={colors} {...gradientProps}>
      {children}
    </RNLinearGradient>
  );
}
