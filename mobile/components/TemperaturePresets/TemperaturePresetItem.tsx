import React, { useMemo } from "react";
import { Platform, StyleSheet } from "react-native";

import Box, { Row, withBoxProps } from "~/components/Box";
import { TemperaturePresetIcon } from "~/components/Icons";
import LinearGradient from "~/components/LinearGradient";
import Text from "~/components/Text";
import { Touchable, Link } from "~/components/Touchables";
import { useScheduleLinearGradient } from "~/hooks";
import { ThemeColor } from "~/theme";

import {
  GoBack,
  useTemperaturePresetQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import i18n from "~/i18n";

import { setpointRange } from "~/utils/display";

const styles = StyleSheet.create({
  presetItem: {
    borderRadius: 60,
    width: 60,
    height: 60,
  },
  presetRow: {
    borderRadius: 40,
    width: 40,
    height: 40,
  },
});

type SharedTemperaturePresetProps = {
  onPress: () => void;
  toDisplay: (n: number) => number;
} & WithQueryDataProps<typeof useTemperaturePresetQuery>;

type TemperaturePresetItemProps = SharedTemperaturePresetProps & {
  isEditing: boolean;
  isSelected: boolean;
  onPressEdit: () => void;
};

const StaticTemperaturePresetRow = ({
  onPress,
  toDisplay = identity,
  data: { temperaturePreset },
}: SharedTemperaturePresetProps): JSX.Element => {
  if (!temperaturePreset) throw new GoBack();

  const { slot, name, setpoint } = temperaturePreset;
  const subtitle = setpointRange(setpoint, toDisplay);
  const gradientProps = useScheduleLinearGradient(slot);

  return (
    <Touchable
      onPress={onPress}
      paddingVertical="m"
      paddingLeft="l"
      backgroundColor={Platform.OS === "ios" ? "listItemBackground" : undefined}
    >
      <Row>
        <LinearGradient {...gradientProps} style={styles.presetRow}>
          <Box
            height={40}
            width={40}
            borderWidth={1}
            borderColor="transparent"
            borderRadius={40}
            alignItems="center"
            justifyContent="center"
          >
            <TemperaturePresetIcon
              slot={slot}
              size={22}
              color={"textOnColor"}
            />
          </Box>
        </LinearGradient>
        <Box marginHorizontal={"m"} flexShrink={1}>
          <Text variant="heading" numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <Text variant="body">{subtitle}</Text>
        </Box>
      </Row>
    </Touchable>
  );
};

const StaticTemperaturePresetItem = ({
  isEditing,
  isSelected,
  onPress,
  onPressEdit,
  toDisplay,
  data: { temperaturePreset },
  ...rest
}: TemperaturePresetItemProps): JSX.Element => {
  if (!temperaturePreset) throw new GoBack();

  const { slot, name, setpoint } = temperaturePreset;
  const subtitle = setpointRange(setpoint, toDisplay);
  const gradientProps = useScheduleLinearGradient(slot);

  const gradientColors: [ThemeColor, ThemeColor] = isEditing
    ? ["temperaturePresetIconBG", "temperaturePresetIconBG"]
    : gradientProps.colors;

  const iconColor = isEditing ? "text" : "textOnColor";
  const fontColor = isEditing ? "textOnColor" : "text";

  return (
    <Box {...rest}>
      <Touchable onPress={onPress}>
        <Box alignItems="center">
          <LinearGradient
            {...gradientProps}
            colors={gradientColors}
            style={styles.presetItem}
          >
            <Box
              height={60}
              width={60}
              borderWidth={1}
              borderColor="transparent"
              borderRadius={60}
              alignItems="center"
              justifyContent="center"
              {...(isSelected
                ? {
                    borderWidth: 1,
                    borderColor: isEditing
                      ? "manageTemperaturePresetSelectedBorder"
                      : "addTemperaturePresetSelectedBorder",
                  }
                : {})}
            >
              <TemperaturePresetIcon slot={slot} color={iconColor} />
            </Box>
          </LinearGradient>
        </Box>
        <Box marginTop="xs">
          <Text
            variant="scheduleTitleMetadata"
            textAlign="center"
            color={fontColor}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <Text
            variant="presetLabelTemperature"
            textAlign="center"
            color={fontColor}
          >
            {subtitle}
          </Text>
        </Box>
      </Touchable>
      <Link
        variant="presetLabelEdit"
        color={fontColor}
        onPress={onPressEdit}
        text={i18n.t("Common.edit")}
        textAlign="center"
        textDecorationLine="none"
        touchableProps={{ marginTop: "xs" }}
      />
    </Box>
  );
};

const SharedQuery = withQueryData(useTemperaturePresetQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: (_, queryId) =>
    useMemo(() => ({ temperaturePresetId: queryId }), [queryId]),
});

export const ConnectedTemperaturePresetRow = SharedQuery(
  StaticTemperaturePresetRow
);
export const ConnectedTemperaturePresetItem = SharedQuery(
  withBoxProps(StaticTemperaturePresetItem)
);
