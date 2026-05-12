import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

import i18n from "~/i18n";

import { useControlledDialContext } from "~/contexts/ControlledDialContext";

import Box from "~/components/Box";
import StepperButton from "~/components/Touchables/StepperButton";
import Text from "~/components/Text";

import {
  displayableDecimalValueOfNumber,
  displayValueWithoutDecimal,
  hasDecimalPlace,
  makeToDisplay,
} from "~/utils/display";

import { ARC_RAD, ARC_WIDTH } from "./constants";

import Ring from "./StaticRing";
import useStaticDial from "./useStaticDial";

const scope = "Components.Dial";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  temperatureContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  celciusDecimal: {
    position: "absolute",
    top: 18,
    right: 15,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
});

interface StaticDialProps {
  disabled?: boolean;
  onDecreasePress: () => void;
  onIncreasePress: () => void;

  trackColor: string;
  children: React.ReactNode[];
}

function StaticDial({
  disabled,
  onDecreasePress,
  onIncreasePress,
  trackColor,
  children,
}: StaticDialProps): JSX.Element {
  const {
    dimensions: { dialSize, growUp },
  } = useStaticDial();
  const { temperatureAmbient, temperatureUnit } = useControlledDialContext();

  const toDisplay = makeToDisplay(temperatureUnit);

  return (
    <View style={[styles.container, { marginTop: -growUp }]}>
      <View style={styles.temperatureContainer}>
        <Box paddingHorizontal="l" marginTop="m">
          <Text variant="dialAmbientInteger" maxFontSizeMultiplier={1}>
            {temperatureAmbient
              ? displayValueWithoutDecimal(toDisplay(temperatureAmbient))
              : "-"}
          </Text>
          {temperatureAmbient &&
          hasDecimalPlace(toDisplay(temperatureAmbient)) ? (
            <Box position="absolute" right={0}>
              <Text variant="dialAmbientFraction" maxFontSizeMultiplier={1}>
                {displayableDecimalValueOfNumber(toDisplay(temperatureAmbient))}
              </Text>
            </Box>
          ) : null}
        </Box>
        <Text variant="dialAmbientLabel">{i18n.t("indoor", { scope })}</Text>
      </View>
      <View style={{ width: dialSize, height: dialSize }}>
        <Ring
          startAngle={0}
          endAngle={ARC_RAD}
          stroke={trackColor}
          strokeWidth={ARC_WIDTH}
          shadow={true}
        />
        {children}
      </View>
      <View style={styles.controlsContainer}>
        <StepperButton
          variant={disabled ? "disabled" : undefined}
          disabled={disabled}
          direction={"down"}
          onPress={onDecreasePress}
        />
        <Box width={22} />
        <StepperButton
          variant={disabled ? "disabled" : undefined}
          disabled={disabled}
          direction={"up"}
          onPress={onIncreasePress}
        />
      </View>
    </View>
  );
}

export default memo(StaticDial);
