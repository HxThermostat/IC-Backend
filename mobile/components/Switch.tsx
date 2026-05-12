import React from "react";
import { Platform } from "react-native";

import { Switch as RNGHSwitch } from "react-native-gesture-handler";

import { useTheme } from "~/theme";

type SwitchProps = React.ComponentProps<typeof RNGHSwitch>;

const Switch = (props: SwitchProps): JSX.Element => {
  const { colors } = useTheme();

  let trackColorProps: Pick<SwitchProps, "trackColor"> = {};

  trackColorProps = Platform.select({
    ios: {
      trackColor: {
        false: colors.switchIOSTrackColorTrue,
        true: colors.switchIOSTrackColorFalse,
      },
      thumbColor: props.value
        ? colors.switchIOSThumbTrue
        : colors.switchIOSThumbFalse,
    },
    default: {
      trackColor: {
        false: colors.switchAndroidTrackColorFalse,
        true: colors.switchAndroidTrackColorTrue,
      },
      thumbColor: props.value
        ? colors.switchAndroidThumbTrue
        : colors.switchAndroidThumbFalse,
    },
  });

  if (props.disabled && Platform.OS === "android") {
    trackColorProps.trackColor = {
      false: colors.switchAndroidTrackColorFalseDisabled,
      true: colors.switchAndroidTrackColorTrueDisabled,
    };
  }

  return <RNGHSwitch {...props} {...trackColorProps} />;
};

export default Switch;
