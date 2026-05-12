import React from "react";

import { Platform, StyleSheet } from "react-native";

import Box, { Row } from "~/components/Box";
import HumidityTempOutdoor, {
  HumidityTempOutdoorProps,
} from "~/components/Home/HumidityTempOutdoor";

import { ChevronIcon, HomeSettingsIcon } from "~/components/Icons";

import Text from "~/components/Text";

import { Touchable } from "~/components/Touchables";

const CHEVRON_SIZE = 20;
const CHEVRON_OVERFLOW_ADJUST = 0.8;

const styles = StyleSheet.create({
  titleTextContainer: {
    paddingRight: CHEVRON_SIZE,
  },
  titleChevronContainer: {
    // This is a hack to align nicely after the ellipsis on Android
    marginLeft: -1 * (CHEVRON_SIZE * CHEVRON_OVERFLOW_ADJUST),
  },
  titleChevron: {
    width: CHEVRON_SIZE / CHEVRON_OVERFLOW_ADJUST,
  },
});

type TitleBarProps = {
  showBadge: boolean;
  onPressSettingsIcon: () => void;
  onPressChangeController: () => void;
  title: string;
} & HumidityTempOutdoorProps;

const TitleBar = ({
  humidityAmbient,
  onPressChangeController,
  onPressSettingsIcon,
  showBadge,
  temperatureOutdoor,
  temperatureUnit,
  title,
}: TitleBarProps): JSX.Element => {
  return (
    <Box
      paddingHorizontal="m"
      marginTop={Platform.select({ ios: "m", default: "z" })}
    >
      <HomeSettingsIcon
        badgeVisible={showBadge}
        onPress={onPressSettingsIcon}
      />
      <Row>
        <Box flex={1} flexShrink={1} marginRight="l" flexDirection="row">
          <Touchable
            shareAndroidContainerStyle={true}
            onPress={onPressChangeController}
          >
            <Row>
              <Box style={styles.titleTextContainer}>
                <Text
                  variant="largeTitle"
                  ellipsizeMode="tail"
                  maxFontSizeMultiplier={1}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              </Box>
              <Box
                flexDirection="column"
                justifyContent="flex-end"
                marginBottom="xs"
                style={styles.titleChevronContainer}
              >
                <ChevronIcon
                  direction="chevron-down"
                  size={20}
                  style={styles.titleChevron}
                />
              </Box>
            </Row>
          </Touchable>
        </Box>
        <Box flex={0} flexShrink={0} paddingVertical="s">
          <HumidityTempOutdoor
            humidityAmbient={humidityAmbient}
            temperatureOutdoor={temperatureOutdoor}
            temperatureUnit={temperatureUnit}
          />
        </Box>
      </Row>
    </Box>
  );
};

export default TitleBar;
