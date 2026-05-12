import React from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  ActivityIndicatorProps as RNActivityIndicatorProps,
  Platform,
} from "react-native";

import { ActivityIndicator as PaperActivityIndicator } from "react-native-paper";

import { withBoxProps } from "~/components/Box";

import { useForegroundColor } from "~/contexts";

import { ColorProps, useThemeColor } from "~/theme";

export type ActivityIndicatorProps = Omit<RNActivityIndicatorProps, "color"> &
  ColorProps;

const ActivityIndicator = (props: ActivityIndicatorProps): JSX.Element => {
  const foreground = useForegroundColor(
    Platform.select({
      ios: ["text", "textOnColor"],
      default: ["tint", "textOnColor"],
    })
  );

  const propColor = useThemeColor(props.color);
  const foregroundColor = useThemeColor(foreground.color);

  const color = propColor ?? foregroundColor;

  // Don't take the performance hit if we're using a color explicitly
  // provided as a prop
  const onLayout = props.color ? undefined : foreground.onLayout;

  return Platform.select({
    ios: <RNActivityIndicator {...props} color={color} onLayout={onLayout} />,
    default: (
      <PaperActivityIndicator {...props} color={color} onLayout={onLayout} />
    ),
  });
};

ActivityIndicator.displayName = "ActivityIndicator";
export default withBoxProps(ActivityIndicator);
