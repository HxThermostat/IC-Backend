import React from "react";

import { Slot } from "~/graph";

import { ThemeColor } from "~/theme/color";

import Box, { BoxProps } from "~/components/Box";

import {
  AwayPresetIcon,
  CustomPresetIcon,
  HomePresetIcon,
  SleepPresetIcon,
  ThermostatPresetIcon,
} from "./SchedulePresetIcons";
import { PlusIcon } from "./VectorIcon";
import { useThemeColor } from "~/theme";

interface TemperaturePresetIconProps {
  slot: Slot | null;
  color: ThemeColor;
  size?: number;
}
export const TemperaturePresetIcon = ({
  slot,
  color: themeColor,
  size = 30,
}: TemperaturePresetIconProps): JSX.Element => {
  const color = useThemeColor(themeColor);

  switch (slot) {
    case "HOME":
      return <HomePresetIcon color={color} height={size} width={size} />;
    case "AWAY":
      return <AwayPresetIcon color={color} height={size} width={size} />;
    case "SLEEP":
      return <SleepPresetIcon color={color} height={size} width={size} />;
    case "CUSTOM":
      return <CustomPresetIcon color={color} height={size} width={size} />;
    default:
      return <ThermostatPresetIcon color={color} height={size} width={size} />;
  }
};

type AddTemperaturePresetIconProps = {
  color: ThemeColor;
  size?: number;
  innerBoxProps?: BoxProps;
};
export const AddTemperaturePresetIcon = ({
  color,
  size = 30,
  innerBoxProps,
}: AddTemperaturePresetIconProps): JSX.Element => {
  return (
    <Box
      width={60}
      height={60}
      borderWidth={1}
      borderColor="transparent"
      borderRadius={size * 2}
      alignItems="center"
      justifyContent="center"
      backgroundColor={"temperaturePresetIconBG"}
      {...innerBoxProps}
    >
      <PlusIcon color={color} size={size} />
    </Box>
  );
};
